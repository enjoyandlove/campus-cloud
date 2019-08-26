import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { CPDate } from '@campus-cloud/shared/utils/date/date';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { WallsIntegrationsService } from '../../walls-integrations.service';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import {
  IWallsIntegration,
  WallsIntegrationModel
} from '@campus-cloud/libs/integrations/walls/model';

@Injectable()
export class IntegrationsEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpTracking: CPTrackingService,
    private service: WallsIntegrationsService,
    private commonUtils: CommonIntegrationUtilsService
  ) {}

  @Effect()
  getIntegrations$: Observable<
    fromActions.GetIntegrationsSuccess | fromActions.GetIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_INTEGRATIONS),
    mergeMap((action: fromActions.GetIntegrations) => {
      const { startRange, endRange } = action.payload;
      return this.service.getIntegrations(startRange, endRange, this.defaultParams()).pipe(
        map((data: IWallsIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
        catchError((error) => {
          return of(
            new fromActions.GetIntegrationsFail({ error: parseErrorResponse(error.error) })
          );
        })
      );
    })
  );

  @Effect()
  deleteIntegration$: Observable<
    | fromActions.DeleteIntegrationFail
    | fromActions.DeleteIntegrationSuccess
    | fromActions.ResetSocialPostCategories
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.DELETE_INTEGRATION),
    mergeMap((action: fromActions.DeleteIntegration) => {
      const { integration } = action.payload;
      return this.service.deleteIntegration(integration.id, this.defaultParams()).pipe(
        mergeMap(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_DELETED_FEED_INTEGRATION,
            this.getEventProperties(integration)
          );
          return [
            new fromActions.ResetSocialPostCategories(),
            new fromActions.DeleteIntegrationSuccess({ deletedId: integration.id })
          ];
        }),
        catchError((error) =>
          of(new fromActions.DeleteIntegrationFail({ error: parseErrorResponse(error.error) }))
        )
      );
    })
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    mergeMap((action: fromActions.PostIntegration) => {
      const { body, channelType } = action.payload;
      return this.service.createIntegration(body, this.defaultParams()).pipe(
        map((data: IWallsIntegration) => {
          const eventProperties = {
            channel_type: channelType,
            ...this.getEventProperties(data)
          };
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_ADDED_FEED_INTEGRATION,
            eventProperties
          );
          return new fromActions.PostIntegrationSuccess(data);
        }),
        catchError(({ error }: HttpErrorResponse) =>
          of(new fromActions.PostIntegrationFail(this.commonUtils.handleCreateUpdateError(error)))
        )
      );
    })
  );

  @Effect()
  postIntegrationSuccess$: Observable<fromActions.SyncNow> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION_SUCCESS),
    map((action: fromActions.PostIntegrationSuccess) => action.payload),
    mergeMap((integration) =>
      of(
        new fromActions.SyncNow({
          integration,
          error: null,
          succesMessage: 't_shared_saved_update_success_message'
        })
      )
    )
  );

  @Effect()
  editIntegration$: Observable<
    fromActions.EditIntegrationSuccess | fromActions.EditIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.EDIT_INTEGRATION),
    mergeMap((action: fromActions.EditIntegration) => {
      const { integrationId, body } = action.payload;
      return this.service.editIntegration(integrationId, body, this.defaultParams()).pipe(
        map((edited: IWallsIntegration) => new fromActions.EditIntegrationSuccess(edited)),
        catchError((error) =>
          of(new fromActions.EditIntegrationFail({ error: parseErrorResponse(error.error) }))
        )
      );
    })
  );

  @Effect()
  getSocialPostCategories$: Observable<
    fromActions.GetSocialPostCategoriesSuccess | fromActions.GetSocialPostCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_SOCIAL_POST_CATEGORIES),
    mergeMap(() => {
      return this.service.getSocialPostCategories(this.defaultParams()).pipe(
        map((data: IItem[]) => new fromActions.GetSocialPostCategoriesSuccess(data)),
        catchError((error) =>
          of(
            new fromActions.GetSocialPostCategoriesFail({ error: parseErrorResponse(error.error) })
          )
        )
      );
    })
  );

  @Effect()
  syncNow$: Observable<fromActions.SyncNowSuccess | fromActions.SyncNowFail> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.SYNC_NOW),
    map((action: fromActions.SyncNow) => action.payload),
    mergeMap(({ integration, succesMessage, error }) => {
      const search = new HttpParams()
        .set('sync_now', '1')
        .set('school_id', this.session.g.get('school').id)
        .set('feed_obj_type', '3');

      return this.service.syncNow(integration.id, search).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_SYNCED_FEED_INTEGRATION,
            this.getEventProperties(integration)
          );
          const editedIntegration = {
            ...integration,
            sync_status: WallsIntegrationModel.status.successful,
            last_successful_sync_epoch: CPDate.now(this.session.tz).unix()
          };

          return new fromActions.SyncNowSuccess({
            integration: editedIntegration,
            message: succesMessage
          });
        }),
        catchError((err: HttpErrorResponse) => {
          const timedOut = 0;
          const requestTimedOut = err.status === timedOut;
          error = requestTimedOut ? null : error;
          const sync_status = requestTimedOut
            ? WallsIntegrationModel.status.running
            : WallsIntegrationModel.status.error;

          const failedIntegration = {
            ...integration,
            sync_status
          };

          return of(new fromActions.SyncNowFail({ integration: failedIntegration, error }));
        })
      );
    })
  );

  @Effect()
  createAndSync$: Observable<fromActions.PostIntegration> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.CREATE_AND_SYNC),
    map((action: fromActions.CreateAndSync) => action.payload),
    mergeMap((payload) => of(new fromActions.PostIntegration(payload)))
  );

  private getEventProperties(integration) {
    return {
      feed_id: integration.id,
      sub_menu_name: amplitudeEvents.WALL,
      feed_type: CommonIntegrationUtilsService.getSelectedType(integration.feed_type).label
    };
  }

  private defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;
    return new HttpParams().set('school_id', school_id);
  }
}

import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import * as fromActions from '../actions';
import { CPDate } from '@campus-cloud/shared/utils/date';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { IntegrationsService } from './../../integrations.service';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { StoreService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { EventIntegration } from '@projects/campus-cloud/src/app/libs/integrations/events/model';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { IntegrationsUitlsService } from '@controlpanel/manage/events/integrations/integrations.utils.service';

@Injectable()
export class IntegrationsEffects {
  somethingWentWrong = { error: this.cpI18n.translate('something_went_wrong') };

  @Effect()
  getHosts$: Observable<
    fromActions.GetHostsSuccess | fromActions.GetHostsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_HOSTS),
    mergeMap((action: fromActions.GetHosts) => {
      return this.storeService.getStores(this.defaultParams()).pipe(
        map((data: any[]) => new fromActions.GetHostsSuccess(data)),
        catchError(() => of(new fromActions.GetHostsFail(this.somethingWentWrong)))
      );
    })
  );

  @Effect()
  getIntegrations$: Observable<
    fromActions.GetIntegrationsSuccess | fromActions.GetIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_INTEGRATIONS),
    mergeMap((action: fromActions.GetIntegrations) => {
      const { startRange, endRange } = action.payload;
      return this.service.getIntegrations(startRange, endRange, this.defaultParams()).pipe(
        map((data: IEventIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
        catchError(() => of(new fromActions.GetIntegrationsFail(this.somethingWentWrong)))
      );
    })
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    map((action: fromActions.PostIntegration) => action.payload),
    mergeMap(({ body, hostType }) => {
      return this.service.createIntegration(body, this.defaultParams()).pipe(
        map((integration: IEventIntegration) => {
          const eventProperties = {
            host_type: hostType,
            ...this.getEventProperties(integration)
          };

          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_ADDED_FEED_INTEGRATION,
            eventProperties
          );
          return new fromActions.PostIntegrationSuccess(integration);
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
  editIntegrationSuccess$: Observable<fromActions.SyncNow> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.EDIT_INTEGRATION_SUCCESS),
    map((action: fromActions.EditIntegrationSuccess) => action.payload),
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
  syncNow$: Observable<fromActions.SyncNowSuccess | fromActions.SyncNowFail> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.SYNC_NOW),
    map((action: fromActions.SyncNow) => action.payload),
    mergeMap(({ integration, succesMessage, error }) => {
      const search = new HttpParams()
        .set('sync_now', '1')
        .set('school_id', this.session.g.get('school').id)
        .set('feed_obj_type', EventIntegration.objectType.campusEvent.toString());

      return this.service.syncNow(integration.id, search).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_SYNCED_FEED_INTEGRATION,
            this.getEventProperties(integration)
          );

          const editedIntegration = {
            ...integration,
            sync_status: EventIntegration.status.successful,
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
            ? EventIntegration.status.running
            : EventIntegration.status.error;

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

  @Effect()
  updateAndSync$: Observable<fromActions.EditIntegration> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.UPDATE_AND_SYNC),
    map((action: fromActions.UpdateAndSync) => action.payload),
    mergeMap((payload) => of(new fromActions.EditIntegration(payload)))
  );

  @Effect()
  deleteIntegration$: Observable<
    fromActions.DeleteIntegrationSuccess | fromActions.DeleteIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.DELETE_INTEGRATION),
    mergeMap((action: fromActions.DeleteIntegration) => {
      const { integration } = action.payload;
      return this.service.deleteIntegration(integration.id, this.defaultParams()).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_DELETED_FEED_INTEGRATION,
            this.getEventProperties(integration)
          );

          return new fromActions.DeleteIntegrationSuccess({ deletedId: integration.id });
        }),
        catchError(() => of(new fromActions.DeleteIntegrationFail(this.somethingWentWrong)))
      );
    })
  );

  @Effect()
  editIntegration$: Observable<
    fromActions.EditIntegrationSuccess | fromActions.EditIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.EDIT_INTEGRATION),
    mergeMap((action: fromActions.EditIntegration) => {
      const { integrationId, body } = action.payload;
      return this.service.editIntegration(integrationId, body, this.defaultParams()).pipe(
        map((edited: IEventIntegration) => new fromActions.EditIntegrationSuccess(edited)),
        catchError(({ error }: HttpErrorResponse) =>
          of(new fromActions.EditIntegrationFail(this.commonUtils.handleCreateUpdateError(error)))
        )
      );
    })
  );

  private getEventProperties(integration) {
    return {
      feed_id: integration.id,
      sub_menu_name: amplitudeEvents.EVENT,
      feed_type: CommonIntegrationUtilsService.getSelectedType(integration.feed_type).label
    };
  }

  private defaultParams(): HttpParams {
    const school_id = this.session.g.get('school').id;

    return IntegrationsUitlsService.commonParams(school_id);
  }

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private storeService: StoreService,
    private service: IntegrationsService,
    private cpTracking: CPTrackingService,
    private commonUtils: CommonIntegrationUtilsService
  ) {}
}

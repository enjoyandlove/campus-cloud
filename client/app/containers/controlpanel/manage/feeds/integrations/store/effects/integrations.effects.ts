import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import { IItem } from '@shared/components';
import { CPDate } from '@shared/utils/date/date';
import { WallsIntegrationsService } from '../../walls-integrations.service';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { IWallsIntegration, WallsIntegrationModel } from '@libs/integrations/walls/model';

@Injectable()
export class IntegrationsEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private service: WallsIntegrationsService,
    private commonUtils: CommonIntegrationUtilsService
  ) {}

  @Effect()
  getIntegrations$: Observable<
    fromActions.GetIntegrationsSuccess | fromActions.GetIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_INTEGRATIONS),
    mergeMap((action: fromActions.GetIntegrations) => {
      const { startRange, endRange, params } = action.payload;
      return this.service
        .getIntegrations(startRange, endRange, params)
        .pipe(
          map((data: IWallsIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
          catchError((error) => of(new fromActions.GetIntegrationsFail(error)))
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
      const { integrationId, params } = action.payload;
      return this.service
        .deleteIntegration(integrationId, params)
        .pipe(
          mergeMap(() => [
            new fromActions.ResetSocialPostCategories(),
            new fromActions.DeleteIntegrationSuccess({ deletedId: integrationId })
          ]),
          catchError((error) => of(new fromActions.DeleteIntegrationFail(error)))
        );
    })
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    mergeMap((action: fromActions.PostIntegration) => {
      const { body, params } = action.payload;
      return this.service
        .createIntegration(body, params)
        .pipe(
          map((data: IWallsIntegration) => new fromActions.PostIntegrationSuccess(data)),
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
      const { integrationId, body, params } = action.payload;
      return this.service
        .editIntegration(integrationId, body, params)
        .pipe(
          map((edited: IWallsIntegration) => new fromActions.EditIntegrationSuccess(edited)),
          catchError((error) => of(new fromActions.EditIntegrationFail(error)))
        );
    })
  );

  @Effect()
  getSocialPostCategories$: Observable<
    fromActions.GetSocialPostCategoriesSuccess | fromActions.GetSocialPostCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_SOCIAL_POST_CATEGORIES),
    mergeMap((action: fromActions.PostIntegration) => {
      const { params } = action.payload;
      return this.service
        .getSocialPostCategories(params)
        .pipe(
          map((data: IItem[]) => new fromActions.GetSocialPostCategoriesSuccess(data)),
          catchError((error) => of(new fromActions.GetSocialPostCategoriesFail(error)))
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
}

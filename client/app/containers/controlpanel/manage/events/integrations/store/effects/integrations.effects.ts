import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import { CPDate } from '@shared/utils/date';
import { StoreService } from '@shared/services';
import { IntegrationsService } from './../../integrations.service';
import { IEventIntegration } from '@libs/integrations/events/model';
import { EventIntegration } from '@client/app/libs/integrations/events/model';

@Injectable()
export class IntegrationsEffects {
  @Effect()
  getHosts$: Observable<
    fromActions.GetHostsSuccess | fromActions.GetHostsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_HOSTS),
    mergeMap((action: fromActions.GetHosts) => {
      const { params } = action.payload;
      return this.storeService
        .getStores(params)
        .pipe(
          map((data: any[]) => new fromActions.GetHostsSuccess(data)),
          catchError((error) => of(new fromActions.GetHostsFail(error)))
        );
    })
  );

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
          map((data: IEventIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
          catchError((error) => of(new fromActions.GetIntegrationsFail(error)))
        );
    })
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    map((action: fromActions.PostIntegration) => action.payload),
    mergeMap(({ body, params }) => {
      return this.service
        .createIntegration(body, params)
        .pipe(
          map(
            (integration: IEventIntegration) => new fromActions.PostIntegrationSuccess(integration)
          ),
          catchError((err) => of(new fromActions.PostIntegrationFail(err)))
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
          hideError: true,
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
          hideError: true,
          succesMessage: 't_shared_saved_update_success_message'
        })
      )
    )
  );

  @Effect()
  syncNow$: Observable<fromActions.SyncNowSuccess | fromActions.SyncNowFail> = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.SYNC_NOW),
    map((action: fromActions.SyncNow) => action.payload),
    mergeMap(({ integration, succesMessage, hideError }) => {
      const search = new HttpParams()
        .set('sync_now', '1')
        .set('school_id', this.session.g.get('school').id)
        .set('feed_obj_type', EventIntegration.objectType.campusEvent.toString());
      return this.service.syncNow(integration.id, search).pipe(
        map(() => {
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
          hideError = true;
          const errorIn400Range = /^4[0-9].*$/;
          let sync_status = EventIntegration.status.running;

          if (errorIn400Range.test(err.status.toString())) {
            sync_status = EventIntegration.status.error;
            hideError = false;
          }

          const failedIntegration = {
            ...integration,
            sync_status
          };

          return of(new fromActions.SyncNowFail({ integration: failedIntegration, hideError }));
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
      const { integrationId, params } = action.payload;
      return this.service
        .deleteIntegration(integrationId, params)
        .pipe(
          map(() => new fromActions.DeleteIntegrationSuccess({ deletedId: integrationId })),
          catchError((error) => of(new fromActions.DeleteIntegrationFail(error)))
        );
    })
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
          map((edited: IEventIntegration) => new fromActions.EditIntegrationSuccess(edited)),
          catchError((error) => of(new fromActions.EditIntegrationFail(error)))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private storeService: StoreService,
    private service: IntegrationsService
  ) {}
}

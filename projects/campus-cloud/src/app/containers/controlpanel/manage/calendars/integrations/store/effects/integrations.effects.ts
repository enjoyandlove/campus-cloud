import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { CPDate } from '@campus-cloud/shared/utils';
import { CPSession } from '@campus-cloud/session';
import * as fromActions from '../actions';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { ItemsIntegrationsService } from './../../integrations.service';
import { EventIntegration } from '@projects/campus-cloud/src/app/libs/integrations/events/model';
import { StoreService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model/event-integration.interface';

@Injectable()
export class IntegrationsEffects {
  somethingWentWrong = { error: this.cpI18n.translate('something_went_wrong') };

  @Effect()
  getHosts$: Observable<
    fromActions.GetHostsSuccess | fromActions.GetHostsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_HOSTS),
    mergeMap((action: fromActions.GetHosts) => {
      const { params } = action.payload;
      return this.storeService.getStores(params).pipe(
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
      const { startRange, endRange, params } = action.payload;
      return this.service.getIntegrations(startRange, endRange, params).pipe(
        map((data: IEventIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
        catchError(() => of(new fromActions.GetIntegrationsFail(this.somethingWentWrong)))
      );
    })
  );

  @Effect()
  deleteIntegration$: Observable<
    fromActions.DeleteIntegrationSuccess | fromActions.DeleteIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.DELETE_INTEGRATION),
    mergeMap((action: fromActions.DeleteIntegration) => {
      const { integrationId, params } = action.payload;
      return this.service.deleteIntegration(integrationId, params).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_DELETED_FEED_INTEGRATION,
            this.getEventProperties(integrationId)
          );
          return new fromActions.DeleteIntegrationSuccess({ deletedId: integrationId });
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
      const { integrationId, body, params } = action.payload;
      return this.service.editIntegration(integrationId, body, params).pipe(
        map((edited: IEventIntegration) => new fromActions.EditIntegrationSuccess(edited)),
        catchError((error) =>
          of(new fromActions.EditIntegrationFail(this.commonUtils.handleCreateUpdateError(error)))
        )
      );
    })
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
          calendarId: integration.feed_obj_id,
          succesMessage: 't_shared_saved_update_success_message'
        })
      )
    )
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    map((action: fromActions.PostIntegration) => action.payload),
    mergeMap(({ body, calendarId, params }) => {
      return this.service.createIntegration(body, params).pipe(
        map((integration: IEventIntegration) => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_ADDED_FEED_INTEGRATION,
            this.getEventProperties(integration.id)
          );
          return new fromActions.PostIntegrationSuccess({ integration, calendarId });
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
    mergeMap(({ integration, calendarId }) =>
      of(
        new fromActions.SyncNow({
          calendarId,
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
    mergeMap(({ integration, succesMessage, error, calendarId }) => {
      const search = new HttpParams()
        .set('sync_now', '1')
        .set('academic_calendar_id', calendarId.toString())
        .set('school_id', this.session.g.get('school').id)
        .set('feed_obj_type', EventIntegration.objectType.academicEvent.toString());
      return this.service.syncNow(integration.id, search).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_SYNCED_FEED_INTEGRATION,
            this.getEventProperties(integration.id)
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

  private getEventProperties(feed_id) {
    return {
      feed_id,
      feed_type: amplitudeEvents.ICAL,
      host_type: amplitudeEvents.INSTITUTION,
      sub_menu_name: amplitudeEvents.CALENDAR
    };
  }

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private storeService: StoreService,
    private cpTracking: CPTrackingService,
    private service: ItemsIntegrationsService,
    private commonUtils: CommonIntegrationUtilsService
  ) {}
}

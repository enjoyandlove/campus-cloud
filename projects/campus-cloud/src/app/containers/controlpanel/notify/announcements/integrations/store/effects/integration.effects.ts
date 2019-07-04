import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { mergeMap, map, catchError, take } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromActions from '../actions';
import * as fromSelectors from '../selectors';
import { CPSession } from '@campus-cloud/session';
import * as fromRoot from '@campus-cloud/store/base';
import { IAnnouncementsIntegration } from '../../model';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { IntegrationsService } from '../../integrations.service';
import { types } from '@controlpanel/notify/announcements/compose/announcement-types';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import {
  IStore,
  StoreService,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Injectable()
export class AnnouncementIntegrationsEffects {
  hostType: string;

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private storeService: StoreService,
    private service: IntegrationsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromRoot.ISnackbar>,
    private commonUtils: CommonIntegrationUtilsService
  ) {}

  @Effect()
  getAll$: Observable<
    fromActions.GetIntegrationsSuccess | fromActions.GetIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_INTEGRATIONS),
    mergeMap(() => {
      return this.service.getIntegrations(1, 100, this.params).pipe(
        map(
          (integrations: IAnnouncementsIntegration[]) =>
            new fromActions.GetIntegrationsSuccess({ integrations })
        ),
        catchError(() => {
          this.handleError();
          return of(new fromActions.GetIntegrationsFail());
        })
      );
    })
  );

  @Effect()
  deleteById$: Observable<
    fromActions.DeleteIntegrationsSuccess | fromActions.DeleteIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.DELETE_INTEGRATIONS),
    map((action: fromActions.DeleteIntegrations) => action.payload),
    mergeMap(({ integration }) => {
      return this.service.deleteIntegration(integration.id, this.params).pipe(
        map(() => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_DELETED_FEED_INTEGRATION,
            this.getEventProperties(integration)
          );
          return new fromActions.DeleteIntegrationsSuccess({ integrationId: integration.id });
        }),
        catchError(() => {
          this.handleError();
          return of(new fromActions.DeleteIntegrationsFail());
        })
      );
    })
  );

  @Effect()
  getSenders$: Observable<
    fromActions.GetSendersSuccess | fromActions.GetSendersFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_SENDERS),
    mergeMap(() =>
      this.storeService.getStores(this.params).pipe(
        map((stores: IStore[]) => new fromActions.GetSendersSuccess(stores)),
        catchError(() => {
          this.handleError();
          return of(new fromActions.GetSendersFail());
        })
      )
    )
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.CreateIntegrationSuccess | fromActions.CreateIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.CREATE_INTEGRATION),
    map((action: fromActions.CreateIntegration) => action.payload),
    mergeMap((integration: IAnnouncementsIntegration) =>
      this.service.createIntegration(integration, this.params).pipe(
        map((newIntegration: IAnnouncementsIntegration) => {
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.MANAGE_ADDED_FEED_INTEGRATION,
            this.getEventProperties(newIntegration)
          );
          return new fromActions.CreateIntegrationSuccess(newIntegration);
        }),
        catchError(({ error }: HttpErrorResponse) => {
          const errMessage = this.commonUtils.handleCreateUpdateError(error).error;
          this.handleError(errMessage);
          return of(new fromActions.CreateIntegrationFail());
        })
      )
    )
  );

  private get params() {
    return new HttpParams().set('school_id', this.session.g.get('school').id);
  }

  private handleError(body = this.cpI18n.translate('something_went_wrong')) {
    this.store.dispatch(
      new fromRoot.baseActionClass.SnackbarError({
        body
      })
    );
  }

  private setHostType(hostId: number) {
    this.store
      .select(fromSelectors.getSenders)
      .pipe(take(1))
      .subscribe(
        (stores: IStore[]) =>
          (this.hostType = stores.find((store: IStore) => store.value === hostId).hostType)
      );
  }

  private getEventProperties(integration: IAnnouncementsIntegration) {
    this.setHostType(integration.store_id);
    const announcement_type = types.find((t) => t.action === integration.priority).label;

    return {
      announcement_type,
      feed_id: integration.id,
      host_type: this.hostType,
      sub_menu_name: amplitudeEvents.ANNOUNCEMENT,
      feed_type: CommonIntegrationUtilsService.getSelectedType(integration.feed_type).label
    };
  }
}

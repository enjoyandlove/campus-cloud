import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import * as fromRoot from '@app/store/base';
import { IAnnouncementsIntegration } from '../../model';
import { IntegrationsService } from '../../integrations.service';
import { CPI18nService, StoreService, IStore } from '@shared/services';

@Injectable()
export class AnnoucementIntegrationsEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private storeService: StoreService,
    private service: IntegrationsService,
    private store: Store<fromRoot.ISnackbar>
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
    mergeMap(({ integrationId }) => {
      return this.service.deleteIntegration(integrationId, this.params).pipe(
        map(() => new fromActions.DeleteIntegrationsSuccess({ integrationId })),
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
    mergeMap((integration: IAnnouncementsIntegration) =>
      this.service.createIntegration(integration, this.params).pipe(
        map(
          (newIntegration: IAnnouncementsIntegration) =>
            new fromActions.CreateIntegrationSuccess(newIntegration)
        ),
        catchError(() => {
          this.handleError();
          return of(new fromActions.CreateIntegrationFail());
        })
      )
    )
  );

  private get params() {
    return new HttpParams().set('school_id', this.session.g.get('school').id);
  }

  private handleError() {
    this.store.dispatch(
      new fromRoot.baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}

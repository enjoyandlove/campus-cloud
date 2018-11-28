import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { IntegrationsService } from './../../integrations.service';
import { EventIntegration } from './../../model/integration.model';
import { StoreService } from '../../../../../../../shared/services';

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
          map((data: EventIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
          catchError((error) => of(new fromActions.GetIntegrationsFail(error)))
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
          map((data: EventIntegration) => new fromActions.PostIntegrationSuccess(data)),
          catchError((error) => of(new fromActions.PostIntegrationFail(error)))
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
          map((edited: EventIntegration) => new fromActions.EditIntegrationSuccess(edited)),
          catchError((error) => of(new fromActions.EditIntegrationFail(error)))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private service: IntegrationsService,
    private storeService: StoreService
  ) {}
}

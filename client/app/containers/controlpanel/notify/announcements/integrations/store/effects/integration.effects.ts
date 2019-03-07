import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import * as fromRoot from '@app/store/base';
import { CPI18nService } from '@shared/services';
import { IAnnoucementsIntegration } from '../../model';
import { IntegrationsService } from '../../integrations.service';

@Injectable()
export class AnnoucementIntegrationsEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
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
          (integrations: IAnnoucementsIntegration[]) =>
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

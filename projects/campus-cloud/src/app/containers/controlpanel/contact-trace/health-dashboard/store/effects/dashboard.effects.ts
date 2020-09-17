import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ICaseStatus } from '../../../cases/cases.interface';
import { CasesService } from '../../../cases/cases.service';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{ healthDashBoard: fromReducers.HealthDashboardState }>,
    private session: CPSession,
    private service: CasesService
  ) {}

  getCaseStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getCaseStatus),
      withLatestFrom(this.store$.select(fromSelectors.selectAudienceFilter)),
      switchMap(([action, audience]) => {
        let params = new HttpParams().append('school_id', this.session.g.get('school').id);
        if (audience) {
          params = params.set('count_user_list_id', audience.listId);
        }
        return this.service.getCaseStatus(params).pipe(
          map((data: ICaseStatus[]) => fromActions.getCaseStatusSuccess({ data })),
          catchError((error) => of(fromActions.getCaseStatusFailure(parseErrorResponse(error))))
        );
      })
    )
  );

  setDateFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.setDateFilter),
      switchMap((action) => {
        // next actions for date filter
        return [];
      })
    )
  );

  setAudienceFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.setAudienceFilter),
      switchMap((action) => {
        return [
          fromActions.getCaseStatus()
          // more actions to be dispatched here...
        ];
      })
    )
  );
}

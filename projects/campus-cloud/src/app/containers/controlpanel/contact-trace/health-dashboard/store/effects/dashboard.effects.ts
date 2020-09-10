import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CPSession } from '@campus-cloud/session';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ICaseStatus } from '../../../cases/cases.interface';
import { CasesService } from '../../../cases/cases.service';
import * as fromActions from '../actions';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private service: CasesService
  ) {}

  getCaseStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getCaseStatus),
      mergeMap((action) => {
        const params = new HttpParams().append('school_id', this.session.g.get('school').id);
        return this.service.getCaseStatus(params).pipe(
          map((data: ICaseStatus[]) => fromActions.getCaseStatusSuccess({ data })),
          catchError((error) => of(fromActions.getCaseStatusFailure(parseErrorResponse(error))))
        );
      })
    )
  );
}

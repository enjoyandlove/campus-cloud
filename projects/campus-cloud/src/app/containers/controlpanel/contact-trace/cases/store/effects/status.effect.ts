import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import * as fromActions from '../actions';
import { CasesService } from '@controlpanel/contact-trace/cases/cases.service';
import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';

@Injectable()
export class CasesStatusEffect {
  constructor(private casesService: CasesService, private session: CPSession, private actions$: Actions) {
  }

  loadCaseStatusById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.CaseStatusActionTypes.GET_CASE_STATUS_BY_ID),
      concatMap((action: fromActions.GetCaseStatusById) => {
        const { id, exclude_external_cases } = action.payload;
          let params = new HttpParams().set('school_id', this.session.g.get('school').id);
          if (exclude_external_cases !== null) {
            params = params.append('exclude_external_cases', exclude_external_cases ? 'true' : 'false');
          }
          return this.casesService
            .getCaseStatusById(id, params)
            .pipe(
              map((caseStatus: ICaseStatus) => new fromActions.GetCaseStatusByIdSuccess(caseStatus)),
              catchError((error) => of(new fromActions.GetCaseStatusByIdSuccess(parseErrorResponse(error)))));
        }
      )
    )
  );

  UpdateCaseStatusCountForView$ =
    createEffect(() => this.actions$.pipe(
      ofType(fromActions.CaseStatusActionTypes.UPDATE_CASE_STATUS_COUNT_FOR_VIEW),
      mergeMap((action: fromActions.UpdateCaseStatusCountForView) => {
        let params = null, state;
        if (action.payload) {
          state = action.payload.state;
          params = this.defaultParamsForCaseStatus(state);
        } else {
          params = new HttpParams().append('school_id', this.session.g.get('school').id);
        }
        return this.casesService.getCaseStatusById(state.current_status_ids, params).pipe(
          map((data: ICaseStatus) => new fromActions.UpdateCaseStatusCountForViewSuccess(data)),
          catchError((error) => of(new fromActions.UpdateCaseStatusCountForViewFail(parseErrorResponse(error))))
        );
      })));

  private defaultParamsForCaseStatus(state): HttpParams {
    return new HttpParams()
      .append('search_str', state.search_str)
      .append('start', state.start)
      .append('end', state.end)
      .append('school_id', this.session.g.get('school').id);
  }
}

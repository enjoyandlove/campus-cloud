import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs/operators';
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
}

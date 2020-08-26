import { map, tap, mergeMap, catchError, filter, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { CPSession } from '@campus-cloud/session';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

import { CasesService } from '../../cases.service';
import * as fromActions from '../actions';
import { ICase, ICaseStatus } from '../../cases.interface';
import { CasesUtilsService } from '../../cases.utils.service';
import { CasesAmplitudeService } from '../../cases.amplitude.service';

@Injectable()
export class CasesEffect {
  constructor(
    private router: Router,
    private actions$: Actions,
    private session: CPSession,
    private service: CasesService,
    private utils: CasesUtilsService,
    private cpTracking: CPTrackingService
  ) {}

  @Effect()
  getCases$: Observable<
    fromActions.GetCasesSuccess | fromActions.GetCasesFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.GET_CASES),
    mergeMap((action: fromActions.GetCases) => {
      const { startRange, endRange, state } = action.payload;
      const params = this.defaultParams(state);

      return this.service.getCases(startRange, endRange, params).pipe(
        map((data: ICase[]) => new fromActions.GetCasesSuccess(data)),
        catchError((error) => of(new fromActions.GetCasesFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  getFilteredCases$: Observable<
    fromActions.GetFilteredCasesSuccess | fromActions.GetFilteredCasesFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.GET_FILTERED_CASES),
    mergeMap((action: fromActions.GetFilteredCases) => {
      const { startRange, endRange, state } = action.payload;
      const params = this.defaultParams(state);
      return this.service.getCases(startRange, endRange, params).pipe(
        map((data: ICase[]) => new fromActions.GetFilteredCasesSuccess(data)),
        catchError((error) => of(new fromActions.GetFilteredCasesFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  getCaseById$: Observable<
    fromActions.GetCaseByIdSuccess | fromActions.GetCaseByIdFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.GET_CASE_BY_ID),
    mergeMap((action: fromActions.GetCaseById) => {
      const { id } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.getCaseById(params, id).pipe(
        map((data: ICase) => new fromActions.GetCaseByIdSuccess(data)),
        catchError((error) => of(new fromActions.GetCaseByIdFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  createCase$: Observable<
    fromActions.CreateCaseSuccess | fromActions.CreateCaseFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.CREATE_CASE),
    mergeMap((action: fromActions.CreateCase) => {
      const { body } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);
      return this.service.createCase(body, params).pipe(
        map((data: ICase) => {
          const eventName = amplitudeEvents.CONTACT_TRACE_CREATED_CASE;
          const properties = {
            ...this.utils.parsedEventProperties(data),
            id: data.id
          };

          this.cpTracking.amplitudeEmitEvent(eventName, properties);
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.CONTACT_TRACE_CREATED_ITEM,
            CasesAmplitudeService.getItemProperties(data)
          );
          return new fromActions.CreateCaseSuccess(data);
        }),
        catchError((error) => of(new fromActions.CreateCaseFail(error.status.toString())))
      );
    })
  );

  @Effect()
  editCase$: Observable<
    fromActions.EditCaseSuccess | fromActions.EditCaseFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.EDIT_CASE),
    mergeMap((action: fromActions.EditCase) => {
      const { id, body } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.updateCase(body, id, params).pipe(
        map((data: ICase) => {
          const eventName = amplitudeEvents.CONTACT_TRACE_UPDATED_CASE;
          const properties = {
            ...this.utils.parsedEventProperties(data),
            id: data.id
          };

          this.cpTracking.amplitudeEmitEvent(eventName, properties);
          this.cpTracking.amplitudeEmitEvent(
            amplitudeEvents.CONTACT_TRACE_UPDATED_ITEM,
            CasesAmplitudeService.getItemProperties(data)
          );
          return new fromActions.EditCaseSuccess({ data: data, id: id });
        }),
        tap(() => this.router.navigate([`/contact-trace/cases/${id}`])),
        catchError((error) => of(new fromActions.EditCaseFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  deleteCase$: Observable<
    fromActions.DeleteCaseSuccess | fromActions.DeleteCaseFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.DELETE_CASE),
    mergeMap((action: fromActions.DeleteCase) => {
      const id = action.payload.id;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.deleteCaseById(id, params).pipe(
        map(() => {
          const deletedItemEventName = amplitudeEvents.DELETED_ITEM;
          const deletedCaseEventName = amplitudeEvents.CONTACT_TRACE_DELETED_CASE;
          const deletedItemEventProperties = this.cpTracking.getAmplitudeMenuProperties();
          const deletedCaseEventProperties = {
            ...this.utils.parsedEventProperties(action.payload),
            id: action.payload.id
          };

          this.cpTracking.amplitudeEmitEvent(deletedItemEventName, deletedItemEventProperties);
          this.cpTracking.amplitudeEmitEvent(deletedCaseEventName, deletedCaseEventProperties);

          return new fromActions.DeleteCaseSuccess({ deletedId: id });
        }),
        catchError((error) => of(new fromActions.DeleteCaseFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  getCaseStatus$: Observable<
    fromActions.GetCaseStatusSuccess | fromActions.GetCaseStatusFail
  > = this.actions$.pipe(
    ofType(fromActions.caseActions.GET_CASE_STATUS),
    mergeMap(() => {
      const params = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.service.getCaseStatus(params).pipe(
        map((data: ICaseStatus[]) => new fromActions.GetCaseStatusSuccess(data)),
        catchError((error) => of(new fromActions.GetCaseStatusFail(parseErrorResponse(error))))
      );
    })
  );

  private defaultParams(state): HttpParams {
    return new HttpParams()
      .append('search_str', state.search_str)
      .append('current_status_ids', state.current_status_ids)
      .append('start', state.start)
      .append('end', state.end)
      .append('school_id', this.session.g.get('school').id);
  }
}

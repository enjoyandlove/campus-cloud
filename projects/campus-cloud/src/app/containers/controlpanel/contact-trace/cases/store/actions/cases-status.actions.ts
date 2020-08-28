import { Action } from '@ngrx/store';
import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';

export enum CaseStatusActionTypes {
  GET_CASE_STATUS_BY_ID = '[contact_trace.cases-status] get case status by id',
  GET_CASE_STATUS_BY_ID_SUCCESS = '[contact_trace.cases-status] get case status by id Success',
  GET_CASE_STATUS_BY_ID_FAIL = '[contact_trace.cases-status] get case status by id Fail',
  UPDATE_CASE_STATUS_COUNT_FOR_VIEW = '[contact_trace.cases.view] update count on case status',
  UPDATE_CASE_STATUS_COUNT_FOR_VIEW_FAIL = '[contact_trace.cases.view] update count on case status Fail',
  UPDATE_CASE_STATUS_COUNT_FOR_VIEW_SUCCESS = '[contact_trace.cases.view] update count on case status Success',
}


export class GetCaseStatusById implements Action {
  readonly type = CaseStatusActionTypes.GET_CASE_STATUS_BY_ID;
  constructor(public payload: { id: number, exclude_external_cases: boolean }) {}
}

export class GetCaseStatusByIdSuccess implements Action {
  readonly type = CaseStatusActionTypes.GET_CASE_STATUS_BY_ID_SUCCESS;
  constructor(public payload: ICaseStatus) {}
}

export class GetCaseStatusByIdFail implements Action {
  readonly type = CaseStatusActionTypes.GET_CASE_STATUS_BY_ID_FAIL;
  constructor(public payload: string) {}
}

export class UpdateCaseStatusCountForView implements Action {
  readonly type = CaseStatusActionTypes.UPDATE_CASE_STATUS_COUNT_FOR_VIEW;
  constructor(public payload?: { startRange: number; endRange: number; state }) {}
}

export class UpdateCaseStatusCountForViewSuccess implements Action {
  readonly type = CaseStatusActionTypes.UPDATE_CASE_STATUS_COUNT_FOR_VIEW_SUCCESS;
  constructor(public payload: ICaseStatus) {}
}

export class UpdateCaseStatusCountForViewFail implements Action {
  readonly type = CaseStatusActionTypes.UPDATE_CASE_STATUS_COUNT_FOR_VIEW_FAIL;
  constructor(public payload: string) {}
}


export type CasesStatusActions =
  GetCaseStatusById
  | GetCaseStatusByIdSuccess
  | GetCaseStatusByIdFail
  | UpdateCaseStatusCountForView
  | UpdateCaseStatusCountForViewSuccess
  | UpdateCaseStatusCountForViewFail;

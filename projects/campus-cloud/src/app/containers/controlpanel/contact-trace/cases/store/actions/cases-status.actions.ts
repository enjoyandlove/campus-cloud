import { Action } from '@ngrx/store';
import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';

export enum CaseStatusActionTypes {
  GET_CASE_STATUS_BY_ID = '[contact_trace.cases-status] get case status by id',
  GET_CASE_STATUS_BY_ID_SUCCESS = '[contact_trace.cases-status] get case status by id Success',
  GET_CASE_STATUS_BY_ID_FAIL = '[contact_trace.cases-status] get case status by id Fail'
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

export type CasesStatusActions =
  GetCaseStatusById
  | GetCaseStatusByIdSuccess
  | GetCaseStatusByIdFail;

import { Action } from '@ngrx/store';

import { ICase, ICaseStatus } from '../../cases.interface';

export enum caseActions {
  GET_CASES = '[contact_trace.cases] get cases',
  GET_CASES_FAIL = '[contact_trace.cases] get cases fail',
  GET_CASES_SUCCESS = '[contact_trace.cases] get cases success',

  GET_FILTERED_CASES = '[contact_trace.cases] get filtered cases',
  GET_FILTERED_CASES_FAIL = '[contact_trace.cases] get filtered cases fail',
  GET_FILTERED_CASES_SUCCESS = '[contact_trace.cases] get filtered cases success',

  SET_SELECTED_CASE_ID = '[contact_trace.cases] set selected case id',

  GET_CASE_BY_ID = '[contact_trace.cases] get case by id',
  GET_CASE_BY_ID_FAIL = '[contact_trace.cases] get case by id fail',
  GET_CASE_BY_ID_SUCCESS = '[contact_trace.cases] get case by id success',

  CREATE_CASE = '[contact_trace.cases] post case',
  CREATE_CASE_FAIL = '[contact_trace.cases] post case fail',
  CREATE_CASE_SUCCESS = '[contact_trace.cases] post case success',

  EDIT_CASE = '[contact_trace.cases] edit case',
  EDIT_CASE_FAIL = '[contact_trace.cases] edit case fail',
  EDIT_CASE_SUCCESS = '[contact_trace.cases] edit case success',

  DELETE_CASE = '[contact_trace.cases] delete case',
  DELETE_CASE_FAIL = '[contact_trace.cases] delete case fail',
  DELETE_CASE_SUCCESS = '[contact_trace.cases] delete case success',

  IMPORT_CASES = '[contact_trace.cases] import cases',
  GET_CASE_STATUS = '[contact_trace.cases] get case status',
  GET_CASE_STATUS_FAIL = '[contact_trace.cases] get case status fail',
  GET_CASE_STATUS_SUCCESS = '[contact_trace.cases] get case status success',

  RESET_ERROR = '[contact_trace.cases] reset error to false',

  DESTROY = '[contact_trace.cases] destroy'
}

export class GetCases implements Action {
  readonly type = caseActions.GET_CASES;
  constructor(public payload: { startRange: number; endRange: number; state }) {}
}

export class GetCasesFail implements Action {
  readonly type = caseActions.GET_CASES_FAIL;
  constructor(public payload: string) {}
}

export class GetCasesSuccess implements Action {
  readonly type = caseActions.GET_CASES_SUCCESS;
  constructor(public payload: ICase[]) {}
}

export class GetFilteredCases implements Action {
  readonly type = caseActions.GET_FILTERED_CASES;
  constructor(public payload: { startRange: number; endRange: number; state }) {}
}

export class GetFilteredCasesFail implements Action {
  readonly type = caseActions.GET_FILTERED_CASES_FAIL;
  constructor(public payload: string) {}
}

export class GetFilteredCasesSuccess implements Action {
  readonly type = caseActions.GET_FILTERED_CASES_SUCCESS;
  constructor(public payload: ICase[]) {}
}

export class GetCaseById implements Action {
  readonly type = caseActions.GET_CASE_BY_ID;
  constructor(public payload: { id: number }) {}
}

export class SetSelectedCaseId implements Action {
  readonly type = caseActions.SET_SELECTED_CASE_ID;
  constructor(public payload: { id: number }) {}
}

export class GetCaseByIdFail implements Action {
  readonly type = caseActions.GET_CASE_BY_ID_FAIL;
  constructor(public payload: string) {}
}

export class GetCaseByIdSuccess implements Action {
  readonly type = caseActions.GET_CASE_BY_ID_SUCCESS;
  constructor(public payload: ICase) {}
}

export class CreateCase implements Action {
  readonly type = caseActions.CREATE_CASE;
  constructor(public payload: { body: ICase }) {}
}

export class CreateCaseFail implements Action {
  readonly type = caseActions.CREATE_CASE_FAIL;
  constructor(public payload: string) {}
}

export class CreateCaseSuccess implements Action {
  readonly type = caseActions.CREATE_CASE_SUCCESS;
  constructor(public payload: ICase) {}
}

export class EditCase implements Action {
  readonly type = caseActions.EDIT_CASE;
  constructor(
    public payload: {
      body: ICase;
      id: number;
    }
  ) {}
}

export class EditCaseFail implements Action {
  readonly type = caseActions.EDIT_CASE_FAIL;
  constructor(public payload: string) {}
}

export class EditCaseSuccess implements Action {
  readonly type = caseActions.EDIT_CASE_SUCCESS;
  constructor(public payload: { data: ICase; id: number }) {}
}

export class DeleteCase implements Action {
  readonly type = caseActions.DELETE_CASE;
  constructor(public payload: ICase) {}
}

export class DeleteCaseFail implements Action {
  readonly type = caseActions.DELETE_CASE_FAIL;
  constructor(public payload: string) {}
}

export class DeleteCaseSuccess implements Action {
  readonly type = caseActions.DELETE_CASE_SUCCESS;
  constructor(public payload: { deletedId: number }) {}
}
export class ImportCases implements Action {
  readonly type = caseActions.IMPORT_CASES;
  constructor(public payload: any) {}
}

export class GetCaseStatus implements Action {
  readonly type = caseActions.GET_CASE_STATUS;
  constructor(public payload?: { startRange: number; endRange: number; state }) {}
}

export class GetCaseStatusFail implements Action {
  readonly type = caseActions.GET_CASE_STATUS_FAIL;
  constructor(public payload: string) {}
}

export class GetCaseStatusSuccess implements Action {
  readonly type = caseActions.GET_CASE_STATUS_SUCCESS;
  constructor(public payload: ICaseStatus[]) {}
}
export class ResetError implements Action {
  readonly type = caseActions.RESET_ERROR;
}

export class Destroy implements Action {
  readonly type = caseActions.DESTROY;
}

export type CasesAction =
  | GetCases
  | GetCasesFail
  | GetCasesSuccess
  | SetSelectedCaseId
  | GetCaseById
  | GetCaseByIdFail
  | GetCaseByIdSuccess
  | CreateCase
  | CreateCaseFail
  | CreateCaseSuccess
  | EditCase
  | EditCaseFail
  | EditCaseSuccess
  | DeleteCase
  | DeleteCaseSuccess
  | DeleteCaseFail
  | ResetError
  | GetFilteredCases
  | GetFilteredCasesFail
  | GetFilteredCasesSuccess
  | ImportCases
  | GetCaseStatus
  | GetCaseStatusSuccess
  | GetCaseStatusFail
  | Destroy;

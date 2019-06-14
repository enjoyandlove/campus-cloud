import { Action } from '@ngrx/store';
import { IEmployer } from '@campus-cloud/app/containers/controlpanel/manage/jobs/employers/employer.interface';

export const LOAD_EMPLOYERS = 'manage.jobs.load employers';
export const LOAD_EMPLOYERS_FAIL = 'manage.jobs.load employers fail';
export const LOAD_EMPLOYERS_SUCCESS = 'manage.jobs.load employers success';

export const CREATE_EMPLOYER = 'manage.jobs.create employer';
export const CREATE_EMPLOYER_FAIL = 'manage.jobs.create employer fail';
export const CREATE_EMPLOYER_SUCCESS = 'manage.jobs.create employer success';

export const EDIT_EMPLOYER = 'manage.jobs.edit employer';
export const EDIT_EMPLOYER_FAIL = 'manage.jobs.edit employer fail';
export const EDIT_EMPLOYER_SUCCESS = 'manage.jobs.edit employer success';

export const DELETE_EMPLOYER = 'manage.jobs.delete employer';
export const DELETE_EMPLOYER_FAIL = 'manage.jobs.delete employer fail';
export const DELETE_EMPLOYER_SUCCESS = 'manage.jobs.delete employer success';

export class LoadEmployers implements Action {
  readonly type = LOAD_EMPLOYERS;
}

export class LoadEmployersFail implements Action {
  readonly type = LOAD_EMPLOYERS_FAIL;
  constructor(public payload: any) {}
}

export class LoadEmployersSuccess implements Action {
  readonly type = LOAD_EMPLOYERS_SUCCESS;
  constructor(public payload: any) {}
}

export class CreateEmployer implements Action {
  readonly type = CREATE_EMPLOYER;
  constructor(public payload: IEmployer) {}
}

export class CreateEmployerFail implements Action {
  readonly type = CREATE_EMPLOYER_FAIL;
  constructor(public payload: any) {}
}

export class CreateEmployerSuccess implements Action {
  readonly type = CREATE_EMPLOYER_SUCCESS;
  constructor(public payload: any) {}
}

export class EditEmployer implements Action {
  readonly type = EDIT_EMPLOYER;
  constructor(public payload: IEmployer) {}
}

export class EditEmployerFail implements Action {
  readonly type = EDIT_EMPLOYER_FAIL;
  constructor(public payload: any) {}
}

export class EditEmployerSuccess implements Action {
  readonly type = EDIT_EMPLOYER_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteEmployer implements Action {
  readonly type = DELETE_EMPLOYER;
  constructor(public payload: number) {}
}

export class DeleteEmployerFail implements Action {
  readonly type = DELETE_EMPLOYER_FAIL;
  constructor(public payload: any) {}
}

export class DeleteEmployerSuccess implements Action {
  readonly type = DELETE_EMPLOYER_SUCCESS;
  constructor(public payload: number) {}
}

export type JobsAction =
  | LoadEmployers
  | LoadEmployersFail
  | LoadEmployersSuccess
  | CreateEmployer
  | CreateEmployerFail
  | CreateEmployerSuccess
  | EditEmployer
  | EditEmployerFail
  | EditEmployerSuccess
  | DeleteEmployer
  | DeleteEmployerFail
  | DeleteEmployerSuccess;

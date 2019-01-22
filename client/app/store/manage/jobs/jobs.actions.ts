import { Action } from '@ngrx/store';

export const LOAD_EMPLOYERS = 'manage.jobs.load employers';
export const LOAD_EMPLOYERS_FAIL = 'manage.jobs.load employers fail';
export const LOAD_EMPLOYERS_SUCCESS = 'manage.jobs.load employers success';

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

export type JobssAction = LoadEmployers | LoadEmployersFail | LoadEmployersSuccess;

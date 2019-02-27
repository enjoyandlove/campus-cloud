import { Action } from '@ngrx/store';

import { ITestersRange } from './testers.state';
import { SORT_DIRECTION } from '@shared/constants';
import { ITestUser } from '@libs/testers/model/test-user.interface';

export enum TestersActions {
  SET_RANGE = '[settings.testers] set range',
  SET_SORT = '[settings.testers] set sort',
  SET_SEARCH = '[settings.testers] set search',
  LOAD = '[settings.testers] load',
  LOAD_OK = '[settings.testers] load OK',
  LOAD_FAIL = '[settings.testers] load fail'
}

export class SetTestersRange implements Action {
  readonly type = TestersActions.SET_RANGE;
  constructor(public payload: ITestersRange) {}
}

export class SetTestersSort implements Action {
  readonly type = TestersActions.SET_SORT;
  constructor(public payload: SORT_DIRECTION) {}
}

export class SetTestersSearch implements Action {
  readonly type = TestersActions.SET_SEARCH;
  constructor(public payload: string) {}
}

export class LoadTesters implements Action {
  readonly type = TestersActions.LOAD;
}

export class LoadTestersOK implements Action {
  readonly type = TestersActions.LOAD_OK;
  constructor(public payload: ITestUser[]) {}
}

export class LoadTestersFail implements Action {
  readonly type = TestersActions.LOAD_FAIL;
  constructor() {}
}

export type TestersAction =
  | SetTestersRange
  | SetTestersSort
  | SetTestersSearch
  | LoadTesters
  | LoadTestersOK
  | LoadTestersFail;

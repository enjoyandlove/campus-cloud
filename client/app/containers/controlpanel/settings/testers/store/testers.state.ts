import { EntityState, Dictionary } from '@ngrx/entity';
import { ActionReducerMap } from '@ngrx/store';

import { ITestersState } from './testers.state';
import * as testersReducer from './testers.reducers';
import { ITestUser } from '@libs/testers/model/test-user.interface';
import { SORT_DIRECTION, SETTINGS_TESTERS } from '@shared/constants';

export interface ITestersRange {
  start: number;
  end: number;
}

export interface ITestersState extends EntityState<ITestUser> {
  // search parameters
  range: ITestersRange;
  sort_direction: SORT_DIRECTION;
  search_str: string;

  // entity
  loaded: boolean;
  loading: boolean;
  entities: Dictionary<ITestUser>;

  // error
  error: string;
}

export interface ITestersFeature {
  [SETTINGS_TESTERS]: ITestersState;
}

export const reducerMap: ActionReducerMap<ITestersFeature> = {
  [SETTINGS_TESTERS]: testersReducer.reducer
};

import { EntityState, Dictionary } from '@ngrx/entity';
import { ActionReducerMap } from '@ngrx/store';

import * as testersReducer from './testers.reducers';
import { ITestUser } from '../models/test-user.interface';
import { SortDirection, SETTINGS_TESTERS } from '@campus-cloud/shared/constants';

export interface ITestersRange {
  start: number;
  end: number;
}

export interface ITestersState extends EntityState<ITestUser> {
  // search parameters
  range: ITestersRange;
  sortDirection: SortDirection;
  searchStr: string;

  // entity
  loading: boolean;
  entities: Dictionary<ITestUser>;
}

export interface ITestersFeature {
  [SETTINGS_TESTERS]: ITestersState;
}

export const reducerMap: ActionReducerMap<ITestersFeature> = {
  settingsTesters: testersReducer.reducer
};

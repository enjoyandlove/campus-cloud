import { EntityState, Dictionary } from '@ngrx/entity';

import { SORT_DIRECTION } from '@shared/constants';
import { ITestUser } from '@libs/testers/model/test-user.interface';

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

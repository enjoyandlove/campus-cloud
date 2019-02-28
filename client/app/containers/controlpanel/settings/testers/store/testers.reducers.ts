import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ITestersState } from './testers.state';
import { SORT_DIRECTION } from '@shared/constants';
import { ITestUser } from '../models/test-user.interface';
import { TestersAction, TestersActions } from './testers.actions';

export const defaultState: ITestersState = {
  range: { start: 1, end: 101 },
  sort_direction: SORT_DIRECTION.ASC,
  search_str: null,
  loading: false,
  entities: {},
  ids: []
};

export const testersAdapter: EntityAdapter<ITestUser> = createEntityAdapter<ITestUser>();
export const initialState: ITestersState = testersAdapter.getInitialState(defaultState);

export function reducer(state = initialState, action: TestersAction) {
  switch (action.type) {
    case TestersActions.SET_RANGE:
      const range = action.payload;
      return {
        ...state,
        range
      };
    case TestersActions.SET_SORT:
      const sort_direction = action.payload;
      return {
        ...state,
        sort_direction
      };
    case TestersActions.SET_SEARCH:
      const search_str = action.payload;
      return {
        ...state,
        search_str
      };
    case TestersActions.LOAD:
      return {
        ...state,
        loading: true
      };
    case TestersActions.LOAD_OK:
      return testersAdapter.addAll(action.payload, {
        ...state,
        loading: false
      });
    case TestersActions.LOAD_FAIL:
      return testersAdapter.removeAll({
        ...state,
        loading: false
      });
    default:
      return state;
  }
}

const { selectAll } = testersAdapter.getSelectors();

export const getTesters = selectAll;

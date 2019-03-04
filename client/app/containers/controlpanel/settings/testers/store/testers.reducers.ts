import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ITestersState } from './testers.state';
import { SortDirection } from '@shared/constants';
import { ITestUser } from '../models/test-user.interface';
import { TestersActionType, TestersActions } from './testers.actions';

export const defaultState: ITestersState = {
  range: { start: 1, end: 101 },
  sortDirection: SortDirection.ASC,
  searchStr: null,
  loading: false,
  entities: {},
  ids: []
};

export const testersAdapter: EntityAdapter<ITestUser> = createEntityAdapter<ITestUser>();
export const initialState: ITestersState = testersAdapter.getInitialState(defaultState);

export function reducer(state = initialState, action: TestersActionType) {
  switch (action.type) {
    case TestersActions.SET_RANGE:
      const range = action.payload;
      return {
        ...state,
        range
      };
    case TestersActions.SET_SORT:
      const sortDirection = action.payload;
      return {
        ...state,
        sortDirection
      };
    case TestersActions.SET_SEARCH:
      const searchStr = action.payload;
      return {
        ...state,
        searchStr
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
    case TestersActions.DELETE:
    case TestersActions.DELETE_FAIL:
      return state;
    case TestersActions.DELETE_OK:
      return testersAdapter.removeOne(action.payload, state);
    default:
      return state;
  }
}

const { selectAll } = testersAdapter.getSelectors();

export const getTesters = selectAll;

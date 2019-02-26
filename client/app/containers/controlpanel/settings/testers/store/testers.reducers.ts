import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ITestersState } from './testers.state';
import { SORT_DIRECTION } from '@shared/constants';
import { TestersAction, TestersActions } from './testers.actions';
import { ITestUser } from '@libs/testers/model/test-user.interface';

export const defaultState: ITestersState = {
  range: { start: 1, end: 101 },
  sort_direction: SORT_DIRECTION.ASC,
  search_str: null,
  loaded: false,
  loading: false,
  entities: {},
  ids: [],
  error: null
};

export const testersAdapter: EntityAdapter<ITestUser> = createEntityAdapter<ITestUser>();
export const initialState: ITestersState = testersAdapter.getInitialState(defaultState);

export function reducer(state = initialState, action: TestersAction) {
  switch (action.type) {
    case TestersActions.SET_RANGE:
      return {
        ...state,
        range: action.payload
      };
    case TestersActions.SET_SORT:
      return {
        ...state,
        sort_direction: action.payload
      };
    case TestersActions.SET_SEARCH:
      return {
        ...state,
        search_str: action.payload
      };
    case TestersActions.LOAD:
      return {
        ...state,
        loaded: false,
        loading: true
      };
    case TestersActions.LOAD_OK:
      return testersAdapter.addAll(action.payload, {
        ...state,
        loaded: true,
        loading: false
      });
    case TestersActions.LOAD_FAIL:
      const error = action.payload.message;
      return {
        ...state,
        loaded: false,
        loading: false,
        error
      };
  }
}

const { selectAll } = testersAdapter.getSelectors();

export const getTesters = selectAll;

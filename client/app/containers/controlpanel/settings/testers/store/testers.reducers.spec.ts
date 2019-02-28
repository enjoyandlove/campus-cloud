import { mockTesters } from '../tests';
import { reducer } from './testers.reducers';
import * as actions from './testers.actions';
import { ITestersState } from './testers.state';
import { defaultState } from './testers.reducers';
import { SORT_DIRECTION } from '@shared/constants';

describe('TestersReducer', () => {
  let state: ITestersState;

  beforeEach(() => {
    state = {
      ...defaultState
    };
  });

  it('should set sort', () => {
    state = reducer(state, new actions.SetTestersSort(SORT_DIRECTION.DESC));
    expect(state.sort_direction).toBe(SORT_DIRECTION.DESC);
  });

  it('should set search', () => {
    const search = 'test';
    state = reducer(state, new actions.SetTestersSearch(search));
    expect(state.search_str).toBe(search);
  });

  it('should set loading', () => {
    state = reducer(state, new actions.LoadTesters());
    expect(state.loading).toBe(true);
  });

  it('should load testers', () => {
    state = reducer(state, new actions.LoadTestersOK(mockTesters));
    expect(state.entities[mockTesters[0].id]).toEqual(mockTesters[0]);
    expect(state.loading).toBe(false);
  });
});

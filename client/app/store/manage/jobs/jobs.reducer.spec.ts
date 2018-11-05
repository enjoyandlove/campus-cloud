import { reducer } from './jobs.reducer';
import * as actions from './jobs.actions';
import { IJobsState } from './jobs.state';

const mockEmployers = require('../../../containers/controlpanel/manage/jobs/employers/mockEmployer.json');

describe('Jobs Reducer', () => {
  let state: IJobsState;
  beforeEach(() => {
    state = {
      employers: [],
      loaded: false,
      loading: false
    };
  });

  it('should set loading', () => {
    state = reducer(state, new actions.LoadEmployers());
    expect(state.loading).toBe(true);
  });

  it('should set loading failed', () => {
    state = reducer(state, new actions.LoadEmployersFail([]));
    expect(state.loaded).toBe(false);
    expect(state.loading).toBe(false);
  });

  it('should set loading success', () => {
    state = reducer(state, new actions.LoadEmployersSuccess(mockEmployers));
    expect(state.loaded).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.employers).toEqual(mockEmployers);
  });
});

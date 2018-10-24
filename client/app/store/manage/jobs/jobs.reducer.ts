import * as actions from './jobs.actions';
import { IJobsState } from './jobs.state';

export const initialState: IJobsState = {
  employers: [],
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: actions.JobssAction): IJobsState {
  switch (action.type) {
    case actions.LOAD_EMPLOYERS: {
      return {
        ...state,
        loading: true
      };
    }
    case actions.LOAD_EMPLOYERS_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
    case actions.LOAD_EMPLOYERS_SUCCESS: {
      const employers = action.payload;

      return {
        ...state,
        employers,
        loaded: true,
        loading: false
      };
    }
  }

  return state;
}

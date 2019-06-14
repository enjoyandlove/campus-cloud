import * as actions from './jobs.actions';
import { IJobsState } from './jobs.state';
import { IItem, getItem } from '@campus-cloud/app/shared/components';

export const initialState: IJobsState = {
  employers: [],
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: actions.JobsAction): IJobsState {
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

    case actions.CREATE_EMPLOYER:
    case actions.CREATE_EMPLOYER_FAIL:
    case actions.EDIT_EMPLOYER:
    case actions.EDIT_EMPLOYER_FAIL:
    case actions.DELETE_EMPLOYER:
    case actions.DELETE_EMPLOYER_FAIL:
      return state;

    case actions.CREATE_EMPLOYER_SUCCESS: {
      const employers = [getItem(action.payload, 'name', 'id'), ...state.employers];
      return {
        ...state,
        employers
      };
    }

    case actions.EDIT_EMPLOYER_SUCCESS: {
      return {
        ...state,
        employers: state.employers.map((employer: IItem) => {
          if (employer.action === action.payload.id) {
            return getItem(action.payload, 'name', 'id');
          }
          return employer;
        })
      };
    }

    case actions.DELETE_EMPLOYER_SUCCESS: {
      return {
        ...state,
        employers: state.employers.filter((employer: IItem) => employer.action !== action.payload)
      };
    }
  }

  return state;
}

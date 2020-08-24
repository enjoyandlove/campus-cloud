import { EntityState, createEntityAdapter, EntityAdapter, Dictionary } from '@ngrx/entity';

import * as fromCases from '../actions';
import { ICase } from '../../cases.interface';

export interface ICaseState extends EntityState<ICase> {
  error: boolean;
  loading: boolean;
  loaded: boolean;
  ids: Array<number>;
  filteredCases: ICase[];
  entities: Dictionary<ICase>;
}

const defaultCase: ICaseState = {
  ids: [],
  entities: {},
  error: false,
  loading: false,
  loaded: false,
  filteredCases: []
};

export const caseAdapter: EntityAdapter<ICase> = createEntityAdapter<ICase>();
export const initialState: ICaseState = caseAdapter.getInitialState(defaultCase);

export function reducer(state = initialState, action: fromCases.CasesAction) {
  switch (action.type) {
    case fromCases.caseActions.GET_CASES: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromCases.caseActions.GET_CASES_SUCCESS: {
      return caseAdapter.addAll(action.payload, {
        ...state,
        error: false,
        loading: false,
        loaded: true
      });
    }

    case fromCases.caseActions.GET_CASES_FAIL: {
      return {
        ...state,
        error: true,
        loading: false,
        loaded: false
      };
    }

    case fromCases.caseActions.GET_FILTERED_CASES: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromCases.caseActions.GET_FILTERED_CASES_SUCCESS: {
      return {
        ...state,
        error: false,
        loading: false,
        loaded: true,
        filteredCases: [...action.payload]
      };
    }

    case fromCases.caseActions.GET_FILTERED_CASES_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromCases.caseActions.GET_CASE_BY_ID: {
      return {
        ...state,
        loading: true
      };
    }

    case fromCases.caseActions.GET_CASE_BY_ID_SUCCESS: {
      return caseAdapter.upsertOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromCases.caseActions.GET_CASE_BY_ID_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromCases.caseActions.CREATE_CASE: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromCases.caseActions.CREATE_CASE_SUCCESS: {
      const data = caseAdapter.addOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });

      return {
        ...data,
        ids: [action.payload.id].concat(state.ids),
        error: false,
        loading: false
      };
    }

    case fromCases.caseActions.CREATE_CASE_FAIL: {
      return {
        ...state,
        error: true,
        loading: false,
        loaded: true
      };
    }

    case fromCases.caseActions.EDIT_CASE: {
      return {
        ...state,
        error: false,
        loading: false
      };
    }

    case fromCases.caseActions.EDIT_CASE_SUCCESS: {
      return caseAdapter.updateOne(
        { id: action.payload.data.id, changes: action.payload.data },
        {
          ...state,
          error: false,
          loading: false
        }
      );
    }

    case fromCases.caseActions.EDIT_CASE_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromCases.caseActions.DELETE_CASE: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: true
      };
    }

    case fromCases.caseActions.DELETE_CASE_SUCCESS: {
      const deletedId = action.payload.deletedId;
      const data = caseAdapter.removeOne(deletedId, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });

      return {
        ...data,
        filteredCases: state.filteredCases.filter((l: ICase) => l.id !== deletedId)
      };
    }

    case fromCases.caseActions.DELETE_CASE_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromCases.caseActions.IMPORT_CASES: {
      return {
        ...state,
        error: false,
        loaded: false,
        loading: false
      };
    }

    case fromCases.caseActions.RESET_ERROR: {
      return {
        ...state,
        error: false
      };
    }

    case fromCases.caseActions.DESTROY: {
      return {
        ...state,
        ...initialState
      };
    }

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities } = caseAdapter.getSelectors();

export const getCases = selectAll;
export const getCaseEntities = selectEntities;
export const getCasesError = (state: ICaseState) => state.error;
export const getCasesLoading = (state: ICaseState) => state.loading;
export const getCasesLoaded = (state: ICaseState) => state.loaded;
export const getFilteredCases = (state: ICaseState) => state.filteredCases;

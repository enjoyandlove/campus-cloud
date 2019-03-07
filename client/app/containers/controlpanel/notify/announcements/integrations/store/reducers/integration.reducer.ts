import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';

import { IAnnoucementsIntegration } from '../../model';
import { IntegrationActions, Actions } from '../actions';

export interface IAnnoucementsIntegrationState extends EntityState<IAnnoucementsIntegration> {
  error: boolean;
  loading: boolean;
  ids: Array<number>;
  entities: Dictionary<IAnnoucementsIntegration>;
}

const _initialState: IAnnoucementsIntegrationState = {
  ids: [],
  entities: {},
  error: false,
  loading: false
};

let adapter: EntityAdapter<IAnnoucementsIntegration>; // avoid line wrapping
adapter = createEntityAdapter<IAnnoucementsIntegration>();

export const initialState: IAnnoucementsIntegrationState = adapter.getInitialState(_initialState);

export function reducer(state = initialState, action: Actions): IAnnoucementsIntegrationState {
  switch (action.type) {
    case IntegrationActions.GET_INTEGRATIONS:
    case IntegrationActions.DELETE_INTEGRATIONS: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case IntegrationActions.GET_INTEGRATIONS_FAIL:
    case IntegrationActions.DELETE_INTEGRATIONS_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case IntegrationActions.GET_INTEGRATIONS_SUCCESS: {
      const { integrations } = action.payload;

      return adapter.addMany(integrations, {
        ...state,
        loading: false
      });
    }

    case IntegrationActions.DELETE_INTEGRATIONS_SUCCESS: {
      const { integrationId } = action.payload;

      return adapter.removeOne(integrationId, {
        ...state,
        loading: false
      });
    }

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities } = adapter.getSelectors();

export const getIntegrations = selectAll;
export const getError = (state: IAnnoucementsIntegrationState) => state.error;
export const getLoading = (state: IAnnoucementsIntegrationState) => state.loading;

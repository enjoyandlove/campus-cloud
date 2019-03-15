import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';

import { IStore } from '@shared/services';
import { IAnnouncementsIntegration } from '../../model';
import { IntegrationActions, Actions } from '../actions';

export interface IAnnouncementsIntegrationState extends EntityState<IAnnouncementsIntegration> {
  error: boolean;
  senders: IStore[];
  loading: boolean;
  ids: Array<number>;
  entities: Dictionary<IAnnouncementsIntegration>;
}

const _initialState: IAnnouncementsIntegrationState = {
  ids: [],
  entities: {},
  error: false,
  loading: false,
  senders: []
};

let adapter: EntityAdapter<IAnnouncementsIntegration>; // avoid line wrapping
adapter = createEntityAdapter<IAnnouncementsIntegration>();

export const initialState: IAnnouncementsIntegrationState = adapter.getInitialState(_initialState);

export function reducer(state = initialState, action: Actions): IAnnouncementsIntegrationState {
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

    case IntegrationActions.GET_SENDERS_SUCCESS: {
      const senders = action.payload;
      return {
        ...state,
        senders
      };
    }

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities } = adapter.getSelectors();

export const getIntegrations = selectAll;
export const getError = (state: IAnnouncementsIntegrationState) => state.error;
export const getLoading = (state: IAnnouncementsIntegrationState) => state.loading;
export const getSenders = (state: IAnnouncementsIntegrationState) => state.senders;

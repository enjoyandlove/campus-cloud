import * as fromIntegrations from '../actions';
import { EventIntegration } from './../../model/integration.model';

export interface IntegrationsState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: Array<any>;
  hosts: Array<any>;
  completedAction: string;
}

export const initialState: IntegrationsState = {
  data: [],
  hosts: [],
  error: false,
  loaded: false,
  loading: false,
  completedAction: null
};

export function reducer(state = initialState, action: fromIntegrations.Actions): IntegrationsState {
  switch (action.type) {
    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_SUCCESS: {
      const data = action.payload;

      return {
        ...state,
        loaded: true,
        error: false,
        loading: false,
        data: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_SUCCESS: {
      const newEventIntegration = action.payload;

      return {
        ...state,
        error: false,
        loaded: false,
        loading: false,
        data: [newEventIntegration, ...state.data],
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: state.data.filter((e) => e.id !== deletedId),
        completedAction: 't_shared_entry_deleted_successfully'
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: state.data.map((e: EventIntegration) => (e.id === edited.id ? edited : e)),
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.GET_HOSTS_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        hosts: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.DESTROY: {
      return {
        ...state,
        completedAction: null
      };
    }

    default: {
      return state;
    }
  }
}

export const getHosts = (state: IntegrationsState) => state.hosts;
export const getIntegrations = (state: IntegrationsState) => state.data;
export const getIntegrationsError = (state: IntegrationsState) => state.error;
export const getIntegrationsLoaded = (state: IntegrationsState) => state.loaded;
export const getIntegrationsLoading = (state: IntegrationsState) => state.loading;
export const getCompletedAction = (state: IntegrationsState) => state.completedAction;

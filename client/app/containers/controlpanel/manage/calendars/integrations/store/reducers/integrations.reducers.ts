import * as fromIntegrations from '../actions';
import { IStore } from '@shared/services/store.service';
import { IEventIntegration } from '@libs/integrations/events/model/event-integration.interface';

export interface IntegrationsState {
  error: boolean;
  loading: boolean;
  hosts: IStore[];
  completedAction: string;
  data: IEventIntegration[];
}

export const initialState: IntegrationsState = {
  data: [],
  hosts: [],
  error: false,
  loading: false,
  completedAction: null
};

export function reducer(state = initialState, action: fromIntegrations.Actions): IntegrationsState {
  switch (action.type) {
    case fromIntegrations.IntegrationActions.SYNC_NOW:
    case fromIntegrations.IntegrationActions.CREATE_AND_SYNC:
    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION:
    case fromIntegrations.IntegrationActions.POST_INTEGRATION:
    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS:
    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION: {
      return {
        ...state,
        loading: true,
        error: false,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.POST_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_FAIL:
    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_SUCCESS: {
      const data = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_SUCCESS: {
      const { integration } = action.payload;

      return {
        ...state,
        error: false,
        data: [integration, ...state.data]
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        completedAction: 't_shared_entry_deleted_successfully',
        data: state.data.filter((e: IEventIntegration) => e.id !== deletedId)
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: false,
        data: state.data.map((e: IEventIntegration) => (e.id === edited.id ? edited : e))
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

    case fromIntegrations.IntegrationActions.SYNC_NOW_FAIL: {
      const { integration, hideError } = action.payload;

      return {
        ...state,
        loading: false,
        error: hideError ? false : true,
        data: state.data.map((i) => (i.id === integration.id ? integration : i)),
        completedAction: hideError ? 't_shared_saved_update_success_message' : null
      };
    }

    case fromIntegrations.IntegrationActions.SYNC_NOW_SUCCESS: {
      const defaultAction = 't_shared_saved_update_success_message';

      const { integration, message } = action.payload;

      return {
        ...state,
        loading: false,
        completedAction: message ? message : defaultAction,
        data: state.data.map((i) => (i.id === integration.id ? integration : i))
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
export const getIntegrationsLoading = (state: IntegrationsState) => state.loading;
export const getCompletedAction = (state: IntegrationsState) => state.completedAction;

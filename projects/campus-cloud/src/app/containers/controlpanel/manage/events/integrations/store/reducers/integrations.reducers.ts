import * as fromIntegrations from '../actions';
import { IStore } from '@campus-cloud/shared/services/store.service';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model/event-integration.interface';

export interface IntegrationsState {
  error: string;
  loading: boolean;
  hosts: IStore[];
  completedAction: string;
  data: IEventIntegration[];
}

export const initialState: IntegrationsState = {
  data: [],
  hosts: [],
  error: null,
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
        error: null,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.POST_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_FAIL:
    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_FAIL: {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_SUCCESS: {
      const data = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        data: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_SUCCESS: {
      const integration = action.payload;

      return {
        ...state,
        error: null,
        data: [integration, ...state.data]
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        completedAction: 't_shared_entry_deleted_successfully',
        data: state.data.filter((e: IEventIntegration) => e.id !== deletedId)
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: null,
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
        hosts: [],
        error: null,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.SYNC_NOW_FAIL: {
      const { integration, error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
        data: state.data.map((i) => (i.id === integration.id ? integration : i)),
        completedAction: error ? null : 't_shared_saved_update_success_message'
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

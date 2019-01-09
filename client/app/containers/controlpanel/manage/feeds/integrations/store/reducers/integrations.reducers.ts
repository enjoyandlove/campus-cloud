import { IItem } from '@shared/components';
import * as fromIntegrations from '../actions';
import { IStore } from '@shared/services/store.service';
import { IWallsIntegration } from '@libs/integrations/walls/model';

export interface IntegrationsState {
  error: boolean;
  loading: boolean;
  hosts: IStore[];
  completedAction: string;
  data: IWallsIntegration[];
  socialPostCategories: IItem[];
}

export const initialState: IntegrationsState = {
  data: [],
  hosts: [],
  error: false,
  loading: false,
  completedAction: null,
  socialPostCategories: []
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
        error: false,
        loading: false,
        data: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION: {
      return {
        ...state,
        error: false,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        completedAction: 't_shared_entry_deleted_successfully',
        data: state.data.filter((e: IWallsIntegration) => e.id !== deletedId)
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION: {
      return {
        ...state,
        error: false,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_SUCCESS: {
      const newEventIntegration = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: [newEventIntegration, ...state.data],
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION: {
      return {
        ...state,
        error: false,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: state.data.map((e: IWallsIntegration) => (e.id === edited.id ? edited : e)),
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES: {
      return {
        ...state,
        loading: true
      };
    }

    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES_SUCCESS: {
      const data = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        socialPostCategories: [...data]
      };
    }

    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loading: false,
        socialPostCategories: []
      };
    }

    case fromIntegrations.IntegrationActions.POST_SOCIAL_POST_CATEGORIES: {
      return {
        ...state,
        error: false,
        loading: true,
        completedAction: null
      };
    }

    case fromIntegrations.IntegrationActions.POST_SOCIAL_POST_CATEGORIES_SUCCESS: {
      const { id, name } = action.payload;

      const newSocialPostCategory = {
        action: id,
        label: name
      };
      return {
        ...state,
        error: false,
        loading: false,
        socialPostCategories: [newSocialPostCategory, ...state.socialPostCategories]
      };
    }

    case fromIntegrations.IntegrationActions.POST_SOCIAL_POST_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    default:
      return state;
  }
}

export const getIntegrations = (state: IntegrationsState) => state.data;
export const getIntegrationsError = (state: IntegrationsState) => state.error;
export const getIntegrationsLoading = (state: IntegrationsState) => state.loading;
export const getCompletedAction = (state: IntegrationsState) => state.completedAction;
export const getSocialPostCategories = (state: IntegrationsState) => state.socialPostCategories;

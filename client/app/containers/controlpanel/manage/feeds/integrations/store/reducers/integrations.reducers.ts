import { IItem } from '@shared/components';
import * as fromIntegrations from '../actions';
import { IStore } from '@shared/services/store.service';
import { IWallsIntegration } from '@libs/integrations/walls/model';

export interface IntegrationsState {
  error: string;
  loading: boolean;
  hosts: IStore[];
  completedAction: string;
  data: IWallsIntegration[];
  socialPostCategories: IItem[];
}

export const initialState: IntegrationsState = {
  data: [],
  hosts: [],
  error: null,
  loading: false,
  completedAction: null,
  socialPostCategories: []
};

export function reducer(state = initialState, action: fromIntegrations.Actions): IntegrationsState {
  switch (action.type) {
    case fromIntegrations.IntegrationActions.SYNC_NOW:
    case fromIntegrations.IntegrationActions.CREATE_AND_SYNC:
    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS:
    case fromIntegrations.IntegrationActions.POST_INTEGRATION:
    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION:
    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION:
    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES:
    case fromIntegrations.IntegrationActions.POST_SOCIAL_POST_CATEGORIES: {
      return {
        ...state,
        error: null,
        loading: true,
        completedAction: null
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

    case fromIntegrations.IntegrationActions.GET_INTEGRATIONS_FAIL:
    case fromIntegrations.IntegrationActions.POST_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_FAIL:
    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES_FAIL:
    case fromIntegrations.IntegrationActions.POST_SOCIAL_POST_CATEGORIES_FAIL: {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false
      };
    }

    case fromIntegrations.IntegrationActions.DELETE_INTEGRATION_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        completedAction: 't_shared_entry_deleted_successfully',
        data: state.data.filter((e: IWallsIntegration) => e.id !== deletedId)
      };
    }

    case fromIntegrations.IntegrationActions.POST_INTEGRATION_SUCCESS: {
      const newEventIntegration = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        data: [newEventIntegration, ...state.data],
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.EDIT_INTEGRATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        data: state.data.map((e: IWallsIntegration) => (e.id === edited.id ? edited : e)),
        completedAction: 't_shared_saved_update_success_message'
      };
    }

    case fromIntegrations.IntegrationActions.GET_SOCIAL_POST_CATEGORIES_SUCCESS: {
      const data = action.payload;

      return {
        ...state,
        error: null,
        loading: false,
        socialPostCategories: [...data]
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
        error: null,
        loading: false,
        socialPostCategories: [newSocialPostCategory, ...state.socialPostCategories]
      };
    }

    case fromIntegrations.IntegrationActions.RESET_SOCIAL_POST_CATEGORIES: {
      return {
        ...state,
        socialPostCategories: []
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

    default:
      return state;
  }
}

export const getIntegrations = (state: IntegrationsState) => state.data;
export const getIntegrationsError = (state: IntegrationsState) => state.error;
export const getIntegrationsLoading = (state: IntegrationsState) => state.loading;
export const getCompletedAction = (state: IntegrationsState) => state.completedAction;
export const getSocialPostCategories = (state: IntegrationsState) => state.socialPostCategories;

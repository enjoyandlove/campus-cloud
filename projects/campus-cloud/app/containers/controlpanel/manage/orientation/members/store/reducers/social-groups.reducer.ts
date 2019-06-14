import * as fromActions from '../actions';
import { ISocialGroup } from './../../../../feeds/model/feeds.interfaces';

export interface SocialGroupState {
  loading: boolean;
  grpupId: number;
  groups: ISocialGroup[];
}

export const initialState: SocialGroupState = {
  loading: false,
  groups: [],
  grpupId: null
};

export function reducer(
  state = initialState,
  action: fromActions.SocialGroupActions
): SocialGroupState {
  switch (action.type) {
    case fromActions.SocialGroupTypes.GET_SOCIAL_GROUPS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromActions.SocialGroupTypes.GET_SOCIAL_GROUPS_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromActions.SocialGroupTypes.GET_SOCIAL_GROUPS_SUCCESS: {
      const { socialGroups } = action.payload;
      return {
        ...state,
        loading: false,
        grpupId: socialGroups[0].id,
        groups: [...state.groups, ...socialGroups]
      };
    }

    default:
      return state;
  }
}

export const getLoading = (state: SocialGroupState) => state.loading;
export const getGroups = (state: SocialGroupState) => state.groups;
export const getGroupId = (state: SocialGroupState) => state.grpupId;

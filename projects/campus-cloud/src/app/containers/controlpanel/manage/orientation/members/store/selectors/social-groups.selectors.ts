import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSocialGroups from '../reducers/social-groups.reducer';

export const getSocialGroupState = createSelector(
  fromFeature.getOrientationMembersState,
  (state: fromFeature.IOrientationMembersState) => state.groups
);

export const getGroupId = createSelector(
  getSocialGroupState,
  fromSocialGroups.getGroupId
);

export const getSocialGroups = createSelector(
  getSocialGroupState,
  fromSocialGroups.getGroups
);

export const getGroupsLoading = createSelector(
  getSocialGroupState,
  fromSocialGroups.getLoading
);

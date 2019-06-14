import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromMembers from './members.reducer';
import * as fromSocialGroups from './social-groups.reducer';

export interface IOrientationMembersState {
  members: fromMembers.OrientationMemberState;
  groups: fromSocialGroups.SocialGroupState;
}

export const reducers: ActionReducerMap<IOrientationMembersState> = {
  members: fromMembers.reducer,
  groups: fromSocialGroups.reducer
};

export const getOrientationMembersState = createFeatureSelector<IOrientationMembersState>(
  'orientationMemberState'
);

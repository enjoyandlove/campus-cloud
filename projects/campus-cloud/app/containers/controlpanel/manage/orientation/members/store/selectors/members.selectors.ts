import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getRouterState } from '@campus-cloud/app/store';
import * as fromMembers from '../reducers/members.reducer';

export const getOrientationMemberState = createSelector(
  fromFeature.getOrientationMembersState,
  (state: fromFeature.IOrientationMembersState) => state.members
);

export const getMembers = createSelector(
  getOrientationMemberState,
  fromMembers.getMembers
);

export const getPageNext = createSelector(
  getOrientationMemberState,
  fromMembers.getNext
);

export const getPagePrevious = createSelector(
  getOrientationMemberState,
  fromMembers.getPrevious
);

export const getMembersLoading = createSelector(
  getOrientationMemberState,
  fromMembers.getLoading
);

export const getCurrentPage = createSelector(
  getRouterState,
  (router) => router.queryParams['page']
);

export const getSortField = createSelector(
  getRouterState,
  (router) => router.queryParams['sort_field']
);

export const getSortDirection = createSelector(
  getRouterState,
  (router) => router.queryParams['sort_direction']
);

export const getPagination = createSelector(
  getOrientationMemberState,
  getRouterState,
  (state: fromMembers.OrientationMemberState, routerState) => {
    return {
      next: state.next,
      previous: state.previous,
      page: Number(routerState.queryParams.page)
    };
  }
);

export const getFilters = createSelector(
  getRouterState,
  ({ queryParams }) => {
    return {
      sort_field: queryParams.sort_field,
      search_str: queryParams.search_str,
      sort_direction: queryParams.sort_direction
    };
  }
);

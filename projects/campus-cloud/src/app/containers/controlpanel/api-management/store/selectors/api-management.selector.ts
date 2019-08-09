import { createSelector } from '@ngrx/store';

import { IAPIManagementState } from '../../model';
import { getFeatureState } from './feature.selector';
import { getRouterState } from '@campus-cloud/store';
import { apiAccessTokenAdaptor } from '../reducers/api-management.reducer';

export const getAPIState = createSelector(
  getFeatureState,
  (state: any) => state.apiManagement
);

export const getTokens = createSelector(
  getAPIState,
  apiAccessTokenAdaptor.getSelectors().selectAll
);

export const getTokenLoading = createSelector(
  getAPIState,
  (state: IAPIManagementState) => state.loading
);

export const getPagination = createSelector(
  getAPIState,
  getRouterState,
  (state: IAPIManagementState, routerState) => {
    return {
      next: state.next,
      previous: state.previous,
      page: Number(routerState.queryParams.page)
    };
  }
);

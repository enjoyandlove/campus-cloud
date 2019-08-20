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

export const getTokenById = createSelector(
  getAPIState,
  (state: IAPIManagementState) => state.entity
);

export const getTokenByIdLoading = createSelector(
  getAPIState,
  (state: IAPIManagementState) => state.entityLoading
);

export const getTokenLoaded = createSelector(
  getAPIState,
  (state: IAPIManagementState) => state.loaded
);

export const getPagination = createSelector(
  getAPIState,
  getRouterState,
  (state: IAPIManagementState, routerState) => {
    const pageNum = Number(routerState.queryParams.page);

    return {
      next: state.next,
      previous: state.previous,
      page: pageNum ? pageNum : 1
    };
  }
);

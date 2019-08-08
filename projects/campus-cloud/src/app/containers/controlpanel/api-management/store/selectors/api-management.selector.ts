import { createSelector } from '@ngrx/store';

import { getFeatureState } from './feature.selector';
import { getRouterState } from '@campus-cloud/store';
import { IAPIManagementState } from '../../api-management.interface';

export const getAPIState = createSelector(
  getFeatureState,
  (state: any) => state.apiManagement
);

export const getAPIs = createSelector(
  getAPIState,
  (state: IAPIManagementState) => state.data
);

export const getAPILoading = createSelector(
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

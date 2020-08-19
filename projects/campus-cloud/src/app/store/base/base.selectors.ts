import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IBaseState } from './base.state';

export const getBaseState = createFeatureSelector<IBaseState>('base');
export const getSnackbarState = createSelector(
  getBaseState,
  (state: IBaseState) => state.SNACKBAR
);
export const getHeaderState = createSelector(
  getBaseState,
  (state: IBaseState) => state.HEADER
);
export const getClubsState = createSelector(
  getBaseState,
  (state: IBaseState) => state.CLUBS
);
export const getAlertState = createSelector(
  getBaseState,
  (state: IBaseState) => state.ALERT
);
export const getAudienceState = createSelector(
  getBaseState,
  (state: IBaseState) => state.AUDIENCE
);

export const getRouterState = createSelector(
  getBaseState,
  (state: IBaseState) => state.ROUTER.state
);
export const getEventsModalState = createSelector(
  getBaseState,
  (state: IBaseState) => state.EVENTS_MODAL
);
export const getServicesModalState = createSelector(
  getBaseState,
  (state: IBaseState) => state.SERVICES_MODAL
);

export const getProvidersModalState = createSelector(
  getBaseState,
  (state: IBaseState) => state.PROVIDERS_MODAL
);

export const getLocationsModalState = createSelector(
  getBaseState,
  (state: IBaseState) => state.LOCATIONS_MODAL
);

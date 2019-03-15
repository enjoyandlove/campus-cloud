import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IAnnoucementsIntegrationState } from '../reducers';
import * as fromIntegrations from '../reducers/integration.reducer';

const getFeatureState = createFeatureSelector('announcementIntegrations');

export const getIntegrationState = createSelector(
  getFeatureState,
  (state: IAnnoucementsIntegrationState) => state.integrations
);
export const getIntegrations = createSelector(
  getIntegrationState,
  fromIntegrations.getIntegrations
);
export const getError = createSelector(getIntegrationState, fromIntegrations.getError);
export const getLoading = createSelector(getIntegrationState, fromIntegrations.getLoading);
export const getSenders = createSelector(getIntegrationState, fromIntegrations.getSenders);

import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import * as fromIntegrations from '../reducers/integrations.reducers';
import { IWallsIntegration } from '@app/libs/integrations/walls/model';

export const getIntegrationsState = createSelector(
  getFeatureState,
  (state: fromFeature.IWallsIntegrationState) => state.integrations
);

export const getIntegrations = createSelector(
  getIntegrationsState,
  fromIntegrations.getIntegrations
);

export const getIntegrationsLoading = createSelector(
  getIntegrationsState,
  fromIntegrations.getIntegrationsLoading
);

export const getIntegrationsError = createSelector(
  getIntegrationsState,
  fromIntegrations.getIntegrationsError
);

export const getCompletedAction = createSelector(
  getIntegrationsState,
  fromIntegrations.getCompletedAction
);

export const getSocialPostCategories = createSelector(
  getIntegrationsState,
  fromIntegrations.getSocialPostCategories
);

export const getIntegrationById = (id: number) =>
  createSelector(getIntegrations, (integrations: IWallsIntegration[]) =>
    integrations.find((i) => i.id === id)
  );

import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import * as fromIntegrations from '../reducers/integrations.reducers';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model';

export const getIntegrationsState = createSelector(
  getFeatureState,
  (state: fromFeature.IEventIntegrationState) => state.integrations
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

export const getIntegrationById = (id: number) =>
  createSelector(
    getIntegrations,
    (integrations: IEventIntegration[]) => integrations.find((i) => i.id === id)
  );

export const getIntegrationsHosts = createSelector(
  getIntegrationsState,
  fromIntegrations.getHosts
);

export const getCompletedAction = createSelector(
  getIntegrationsState,
  fromIntegrations.getCompletedAction
);

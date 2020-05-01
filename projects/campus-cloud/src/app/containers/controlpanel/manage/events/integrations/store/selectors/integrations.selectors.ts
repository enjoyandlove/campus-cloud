import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model';
import * as fromIntegrations from '../reducers/integrations.reducers';

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

export const getIntegrationById = (id: number) =>
  createSelector(
    getIntegrations,
    (integrations: IEventIntegration[]) => integrations.find((i) => i.id === id)
  );

export const getIntegrationsError = createSelector(
  getIntegrationsState,
  fromIntegrations.getIntegrationsError
);

export const getIntegrationsHosts = createSelector(
  getIntegrationsState,
  fromIntegrations.getHosts
);

export const getCompletedAction = createSelector(
  getIntegrationsState,
  fromIntegrations.getCompletedAction
);

export const getPreview = createSelector(
  getIntegrationsState,
  fromIntegrations.getPreview
);

export const getPreviewError = createSelector(
  getIntegrationsState,
  fromIntegrations.getPreviewError
);

export const getPreviewLoading = createSelector(
  getIntegrationsState,
  fromIntegrations.getPreviewLoading
);

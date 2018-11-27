import { createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getFeatureState = createFeatureSelector<fromFeature.IEventIntegrationState>(
  'eventIntegrations'
);

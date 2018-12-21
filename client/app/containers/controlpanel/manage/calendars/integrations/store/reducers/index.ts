import { ActionReducerMap } from '@ngrx/store';

import * as fromIntegrations from './integrations.reducers';

export interface IEventIntegrationState {
  integrations: fromIntegrations.IntegrationsState;
}

export const reducers: ActionReducerMap<IEventIntegrationState> = {
  integrations: fromIntegrations.reducer
};

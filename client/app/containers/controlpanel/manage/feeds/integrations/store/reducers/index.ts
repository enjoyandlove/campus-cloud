import { ActionReducerMap } from '@ngrx/store';

import * as fromIntegrations from './integrations.reducers';

export interface IWallsIntegrationState {
  integrations: fromIntegrations.IntegrationsState;
}

export const reducers: ActionReducerMap<IWallsIntegrationState> = {
  integrations: fromIntegrations.reducer
};

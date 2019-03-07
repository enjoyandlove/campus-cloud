import { ActionReducerMap } from '@ngrx/store';

import { IAnnoucementsIntegrationState as State, reducer } from './integration.reducer';

export interface IAnnoucementsIntegrationState {
  integrations: State;
}

export const reducers: ActionReducerMap<IAnnoucementsIntegrationState> = {
  integrations: reducer
};

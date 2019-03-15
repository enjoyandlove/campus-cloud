import { ActionReducerMap } from '@ngrx/store';

import { IAnnouncementsIntegrationState as State, reducer } from './integration.reducer';

export interface IAnnoucementsIntegrationState {
  integrations: State;
}

export const reducers: ActionReducerMap<IAnnoucementsIntegrationState> = {
  integrations: reducer
};

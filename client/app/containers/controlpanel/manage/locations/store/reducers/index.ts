import { ActionReducerMap } from '@ngrx/store';

import * as fromLocations from './locations.reducer';

export interface ILocationsState {
  locations: fromLocations.ILocationState;
}

export const reducers: ActionReducerMap<ILocationsState> = {
  locations: fromLocations.reducer
};

export * from './router.reducer';

import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';

import { IBaseState } from '../base.state';
import * as fromClubs from './clubs.reducer';
import * as fromAlerts from './alert.reducer';
import * as fromHeaders from './header.reducer';
import * as fromSnackbar from './snackbar.reducer';
import * as fromAudience from './audience.reducer';
import * as fromEvents from './events-modal.reducer';
import * as fromServices from './services-modal.reducer';
import * as fromProviders from './providers-modal.reducer';
import * as fromLocations from './locations-modal.reducer';

export const baseReducers: ActionReducerMap<IBaseState> = {
  ROUTER: routerReducer,
  CLUBS: fromClubs.reducer,
  ALERT: fromAlerts.reducer,
  HEADER: fromHeaders.reducer,
  SNACKBAR: fromSnackbar.reducer,
  AUDIENCE: fromAudience.reducer,
  EVENTS_MODAL: fromEvents.reducer,
  SERVICES_MODAL: fromServices.reducer,
  PROVIDERS_MODAL: fromProviders.reducer,
  LOCATIONS_MODAL: fromLocations.reducer
};

export const baseActions = {
  ALERT_PUSH: fromAlerts.ALERT_PUSH,
  ALERT_DEFAULT: fromAlerts.ALERT_DEFAULT,
  AUDIENCE_IMPORTED: fromAudience.AUDIENCE_IMPORTED,
  AUDIENCE_RESET_IMPORT_AUDIENCE: fromAudience.AUDIENCE_RESET_IMPORT_AUDIENCE,
  CLUBS_MODAL_SET: fromClubs.CLUBS_MODAL_SET,
  CLUBS_MODAL_RESET: fromClubs.CLUBS_MODAL_RESET,
  EVENTS_MODAL_SET: fromEvents.EVENTS_MODAL_SET,
  EVENTS_MODAL_RESET: fromEvents.EVENTS_MODAL_RESET,
  HEADER_UPDATE: fromHeaders.HEADER_UPDATE,
  HEADER_DEFAULT: fromHeaders.HEADER_DEFAULT,
  SERVICES_MODAL_SET: fromServices.SERVICES_MODAL_SET,
  SERVICES_MODAL_RESET: fromServices.SERVICES_MODAL_RESET,
  SNACKBAR_SHOW: fromSnackbar.SNACKBAR_SHOW,
  SNACKBAR_HIDE: fromSnackbar.SNACKBAR_HIDE,
  PROVIDERS_MODAL_SET: fromProviders.PROVIDERS_MODAL_SET,
  PROVIDERS_MODAL_RESET: fromProviders.PROVIDERS_MODAL_RESET,
  LOCATIONS_MODAL_SET: fromLocations.LOCATIONS_MODAL_SET,
  LOCATIONS_MODAL_RESET: fromLocations.LOCATIONS_MODAL_RESET
};

export const baseActionClass = {
  SnackbarSuccess: fromSnackbar.SnackbarSuccess,
  SnackbarError: fromSnackbar.SnackbarError
};

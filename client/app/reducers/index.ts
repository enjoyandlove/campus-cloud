// export { reducer as clubsReducer } from './clubs.reducer';
// export { reducer as alertReducer } from './alert.reducer';
// export { reducer as headerReducer } from './header.reducer';
// export { reducer as mobileReducer } from './mobile.reducer';
// export { reducer as snackBarReducer } from './snackbar.reducer';
// export { reducer as audienceReducer } from './audience.reducer';
// export { reducer as eventsModalReducer } from './events-modal.reducer';
// export { reducer as servicesModalReducer } from './services-modal.reducer';

import * as fromClubs from './clubs.reducer';
import * as fromAlerts from './alert.reducer';
import * as fromHeaders from './header.reducer';
import * as fromSnackbar from './snackbar.reducer';
import * as fromAudience from './audience.reducer';
import * as fromEvents from './events-modal.reducer';
import * as fromServices from './services-modal.reducer';

export const reducers = {
  CLUBS: fromClubs.reducer,
  ALERT: fromAlerts.reducer,
  HEADER: fromHeaders.reducer,
  SNACKBAR: fromSnackbar.reducer,
  AUDIENCE: fromAudience.reducer,
  EVENTS_MODAL: fromEvents.reducer,
  SERVICES_MODAL: fromServices.reducer
};

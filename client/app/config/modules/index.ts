import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TopLevelRoutesModule } from '../../app.routing';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../../containers/auth/auth.module';
import { ControlPanelModule } from '../../containers/controlpanel/controlpanel.module';

import {
  clubsReducer,
  alertReducer,
  mobileReducer,
  headerReducer,
  snackBarReducer,
  eventsModalReducer,
  servicesModalReducer
} from '../../reducers';

const APP_STATE_MODULE = StoreModule.forRoot({
  CLUBS: clubsReducer,
  ALERT: alertReducer,
  HEADER: headerReducer,
  MOBILE: mobileReducer,
  SNACKBAR: snackBarReducer,
  EVENTS_MODAL: eventsModalReducer,
  SERVICES_MODAL: servicesModalReducer
});

export const APP_MODULES = [ APP_STATE_MODULE, HttpModule, FormsModule, BrowserModule,
SharedModule, ReactiveFormsModule, ControlPanelModule, TopLevelRoutesModule,
AuthModule ];


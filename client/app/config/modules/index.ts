import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { TopLevelRoutesModule } from '../../app.routing';
import { AuthModule } from '../../containers/auth/auth.module';
import { ControlPanelModule } from '../../containers/controlpanel/controlpanel.module';
import { SharedModule } from '../../shared/shared.module';

import {
  alertReducer,
  clubsReducer,
  eventsModalReducer,
  headerReducer,
  mobileReducer,
  servicesModalReducer,
  snackBarReducer,
  audienceReducer
} from '../../reducers';

const APP_STATE_MODULE = StoreModule.forRoot({
  CLUBS: clubsReducer,
  ALERT: alertReducer,
  HEADER: headerReducer,
  MOBILE: mobileReducer,
  SNACKBAR: snackBarReducer,
  AUDIENCE: audienceReducer,
  EVENTS_MODAL: eventsModalReducer,
  SERVICES_MODAL: servicesModalReducer
});

export const APP_MODULES = [
  APP_STATE_MODULE,
  HttpModule,
  FormsModule,
  BrowserModule,
  SharedModule,
  ReactiveFormsModule,
  ControlPanelModule,
  TopLevelRoutesModule,
  AuthModule
];

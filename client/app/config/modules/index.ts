import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TopLevelRoutesModule } from '../../app.routing';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../../pages/auth/auth.module';
import { ControlPanelModule } from '../../pages/controlpanel/controlpanel.module';

import {
  alertReducer,
  mobileReducer
} from '../../reducers';

const APP_STATE_MODULE = StoreModule.provideStore({
  MOBILE: mobileReducer,
  ALERT: alertReducer,
});

export const APP_MODULES = [ APP_STATE_MODULE, HttpModule, FormsModule, BrowserModule,
SharedModule, ReactiveFormsModule, ControlPanelModule, TopLevelRoutesModule,
AuthModule ];


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { TopLevelRoutesModule } from '../../app.routing';
import { AuthModule } from '../../containers/auth/auth.module';
import { ControlPanelModule } from '../../containers/controlpanel/controlpanel.module';
import { SharedModule } from '../../shared/shared.module';

import { reducers } from '../../reducers';

const APP_STATE_MODULE = StoreModule.forRoot(reducers);

export const APP_MODULES = [
  APP_STATE_MODULE,
  FormsModule,
  BrowserModule,
  HttpClientModule,
  SharedModule,
  ReactiveFormsModule,
  ControlPanelModule,
  TopLevelRoutesModule,
  AuthModule
];

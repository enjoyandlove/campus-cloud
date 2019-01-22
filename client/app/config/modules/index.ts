import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SortablejsModule } from 'angular-sortablejs';

import { RootStoreModule } from '../../store/';
import { TopLevelRoutesModule } from '../../app.routing';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../../containers/auth/auth.module';
import { ControlPanelModule } from '../../containers/controlpanel/controlpanel.module';

export const APP_MODULES = [
  RootStoreModule,
  FormsModule,
  BrowserModule,
  HttpClientModule,
  SharedModule,
  ReactiveFormsModule,
  ControlPanelModule,
  TopLevelRoutesModule,
  AuthModule,
  SortablejsModule.forRoot({ animation: 150 })
];

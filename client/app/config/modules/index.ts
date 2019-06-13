import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SortablejsModule } from 'angular-sortablejs';

import { ccTheme } from '../../themes';
import { RootStoreModule } from '@app/store';
import { SharedModule } from '@shared/shared.module';
import { TopLevelRoutesModule } from '@app/app.routing';
import { AuthModule } from '@containers/auth/auth.module';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { environment } from '@client/environments/environment';
import { ControlPanelModule } from '@containers/controlpanel/controlpanel.module';

export const APP_MODULES = [
  RootStoreModule,
  FormsModule,
  BrowserModule,
  HttpClientModule,
  LayoutsModule,
  SharedModule,
  ReactiveFormsModule,
  ControlPanelModule,
  TopLevelRoutesModule,
  AuthModule,
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  }),
  SortablejsModule.forRoot({ animation: 150 })
];

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SortablejsModule } from 'ngx-sortablejs';

import { RootStoreModule } from '@campus-cloud/store';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { TopLevelRoutesModule } from '@campus-cloud/app.routing';
import { AuthModule } from '@campus-cloud/containers/auth/auth.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { ControlPanelModule } from '@campus-cloud/containers/controlpanel/controlpanel.module';

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
  BrowserAnimationsModule,
  AuthModule,
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  }),
  SortablejsModule.forRoot({ animation: 150 })
];

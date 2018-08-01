import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { SortablejsModule } from 'angular-sortablejs';
import { TopLevelRoutesModule } from '../../app.routing';
import { AuthModule } from '../../containers/auth/auth.module';
import { ControlPanelModule } from '../../containers/controlpanel/controlpanel.module';
import { reducers } from '../../reducers';
import { SharedModule } from '../../shared/shared.module';

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
  AuthModule,
  SortablejsModule.forRoot({ animation: 150 })
];

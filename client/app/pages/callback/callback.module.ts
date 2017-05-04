import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { CallbackService } from './callback.service';
import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import { SharedModule } from '../../shared/shared.module';
import { CallbackRoutingModule } from './callback.routing.module';

import {
  BaseCheckinComponent,
  ServiceHeaderComponent,
  CheckinServiceComponent
} from './checkin';

import { CheckinService } from './checkin/checkin.service';

@NgModule({
  declarations: [ CallbackComponent, CallbackPasswordResetComponent,
  CheckinServiceComponent, BaseCheckinComponent, ServiceHeaderComponent ],

  imports: [ CommonModule, ReactiveFormsModule, SharedModule, RouterModule,
  CallbackRoutingModule ],

  providers: [ AuthService, CallbackService, CheckinService ],
})
export class CallbackModule {}

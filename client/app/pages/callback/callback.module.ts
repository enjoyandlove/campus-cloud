import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CallbackService } from './callback.service';
import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import { SharedModule } from '../../shared/shared.module';
import { CallbackRoutingModule } from './callback.routing.module';

import {
  BaseCheckinComponent,
  CheckinEventsComponent,
  CheckinServiceComponent,
  CheckinRegisterComponent,
  CheckinEventHeaderComponent,
  CheckinInstructionsComponent,
  CheckinAttendeesListComponent,
  CheckinServiceHeaderComponent
} from './checkin';

import {
  BaseFeedbackComponent,
  FeedbackEventComponent,
  FeedbackServiceComponent
} from './feedback';

import { CheckinService } from './checkin/checkin.service';

@NgModule({
  declarations: [ CallbackComponent, CallbackPasswordResetComponent,
  CheckinServiceComponent, BaseCheckinComponent, CheckinServiceHeaderComponent,
  CheckinRegisterComponent, CheckinAttendeesListComponent, CheckinInstructionsComponent,
  CheckinEventsComponent, CheckinEventHeaderComponent, BaseFeedbackComponent,
  FeedbackEventComponent, FeedbackServiceComponent ],

  imports: [ CommonModule, ReactiveFormsModule, SharedModule, RouterModule,
  CallbackRoutingModule ],

  providers: [ AuthService, CallbackService, CheckinService ],
})
export class CallbackModule {}

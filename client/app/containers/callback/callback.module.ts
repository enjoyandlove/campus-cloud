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
  CheckinServiceHeaderComponent,
  CheckinInternalModalComponent
} from './checkin';

import {
  FeedbackFormComponent,
  BaseFeedbackComponent,
  FeedbackStarsComponent,
  FeedbackEventComponent,
  FeedbackServiceComponent,
  FeedbackConfirmationComponent
} from './feedback';

import {
  AdminInviteComponent
} from './admin-invite';

import { CheckinService } from './checkin/checkin.service';
import { FeedbackService } from './feedback/feedback.service';

@NgModule({
  declarations: [ CallbackComponent, CallbackPasswordResetComponent,
  CheckinServiceComponent, BaseCheckinComponent, CheckinServiceHeaderComponent,
  CheckinRegisterComponent, CheckinAttendeesListComponent, CheckinInstructionsComponent,
  CheckinEventsComponent, CheckinEventHeaderComponent, BaseFeedbackComponent,
  FeedbackEventComponent, FeedbackServiceComponent, FeedbackFormComponent,
  FeedbackStarsComponent, FeedbackConfirmationComponent, AdminInviteComponent,
  CheckinInternalModalComponent ],

  imports: [ CommonModule, ReactiveFormsModule, SharedModule, RouterModule,
  CallbackRoutingModule ],

  providers: [ AuthService, CallbackService, CheckinService, FeedbackService ],
})
export class CallbackModule {}

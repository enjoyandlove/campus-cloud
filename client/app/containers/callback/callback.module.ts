import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminInviteComponent } from './admin-invite';
import { CallbackComponent } from './callback.component';
import { CallbackRoutingModule } from './callback.routing.module';
import { CallbackService } from './callback.service';
import {
  BaseCheckinComponent,
  CheckinAttendeesListComponent,
  CheckinEventHeaderComponent,
  CheckinEventsComponent,
  CheckinInstructionsComponent,
  CheckinInternalModalComponent,
  CheckinRegisterComponent,
  CheckinServiceComponent,
  CheckinServiceHeaderComponent,
  CheckinOrientationEventsComponent
} from './checkin';
import { CheckinService } from './checkin/checkin.service';
import {
  BaseFeedbackComponent,
  FeedbackConfirmationComponent,
  FeedbackEventComponent,
  FeedbackFormComponent,
  FeedbackServiceComponent,
  FeedbackStarsComponent,
  FeedbackOrientationEventComponent
} from './feedback';
import { FeedbackService } from './feedback/feedback.service';
import { CallbackPasswordResetComponent } from './password-reset';

import { SharedModule } from '../../shared/shared.module';

import { AuthService } from '../auth/auth.service';

@NgModule({
  declarations: [
    CallbackComponent,
    CallbackPasswordResetComponent,
    CheckinServiceComponent,
    BaseCheckinComponent,
    CheckinServiceHeaderComponent,
    CheckinRegisterComponent,
    CheckinAttendeesListComponent,
    CheckinInstructionsComponent,
    CheckinEventsComponent,
    CheckinEventHeaderComponent,
    BaseFeedbackComponent,
    FeedbackEventComponent,
    FeedbackServiceComponent,
    FeedbackFormComponent,
    FeedbackStarsComponent,
    FeedbackConfirmationComponent,
    AdminInviteComponent,
    CheckinInternalModalComponent,
    CheckinOrientationEventsComponent,
    FeedbackOrientationEventComponent
  ],

  imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule, CallbackRoutingModule],

  providers: [AuthService, CallbackService, CheckinService, FeedbackService]
})
export class CallbackModule {}

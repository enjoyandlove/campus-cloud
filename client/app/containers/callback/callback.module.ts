import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminInviteComponent } from './admin-invite';
import { CallbackComponent } from './callback.component';
import { CallbackRoutingModule } from './callback.routing.module';
import { CallbackPasswordResetComponent } from './password-reset';

import { AuthService } from '../auth/auth.service';
import { SharedModule } from '@shared/shared.module';
import { CallbackService } from './callback.service';
import { CheckinService } from './checkin/checkin.service';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { FeedbackService } from './feedback/feedback.service';
import { CheckinUtilsService } from './checkin/checkin.utils.service';

import {
  BaseFeedbackComponent,
  FeedbackConfirmationComponent,
  FeedbackEventComponent,
  FeedbackFormComponent,
  FeedbackServiceComponent,
  FeedbackStarsComponent,
  FeedbackOrientationEventComponent
} from './feedback';

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
  CheckinOrientationEventsComponent,
  CheckOutModalComponent
} from './checkin';

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
    FeedbackOrientationEventComponent,
    CheckOutModalComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    CallbackRoutingModule
  ],

  providers: [AuthService, CheckinService, FeedbackService, CallbackService, CheckinUtilsService]
})
export class CallbackModule {}

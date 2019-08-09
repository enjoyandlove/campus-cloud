import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { AuthService } from '../auth/auth.service';
import { CallbackService } from './callback.service';
import { AdminInviteComponent } from './admin-invite';
import { CallbackComponent } from './callback.component';
import { CheckinService } from './checkin/checkin.service';
import { FeedbackService } from './feedback/feedback.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CallbackRoutingModule } from './callback.routing.module';
import { CallbackPasswordResetComponent } from './password-reset';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { CheckinUtilsService } from './checkin/checkin.utils.service';

import {
  BaseFeedbackComponent,
  FeedbackFormComponent,
  FeedbackEventComponent,
  FeedbackStarsComponent,
  FeedbackServiceComponent,
  FeedbackConfirmationComponent,
  FeedbackOrientationEventComponent
} from './feedback';

import {
  BaseCheckinComponent,
  CheckOutModalComponent,
  CheckinEventsComponent,
  CheckinServiceComponent,
  CheckinRegisterComponent,
  CheckinEventHeaderComponent,
  CheckinInstructionsComponent,
  CheckinAttendeesListComponent,
  CheckinInternalModalComponent,
  CheckinServiceHeaderComponent,
  CheckinOrientationEventsComponent
} from './checkin';

@NgModule({
  declarations: [
    CallbackComponent,
    BaseCheckinComponent,
    AdminInviteComponent,
    BaseFeedbackComponent,
    FeedbackFormComponent,
    CheckOutModalComponent,
    CheckinEventsComponent,
    FeedbackEventComponent,
    FeedbackStarsComponent,
    CheckinServiceComponent,
    CheckinRegisterComponent,
    FeedbackServiceComponent,
    CheckinEventHeaderComponent,
    CheckinInstructionsComponent,
    CheckinServiceHeaderComponent,
    CheckinAttendeesListComponent,
    FeedbackConfirmationComponent,
    CheckinInternalModalComponent,
    CallbackPasswordResetComponent,
    CheckinOrientationEventsComponent,
    FeedbackOrientationEventComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    CallbackRoutingModule
  ],

  providers: [
    AuthService,
    CheckinService,
    FeedbackService,
    CheckinUtilsService,
    { provide: ApiService, useClass: CallbackService }
  ]
})
export class CallbackModule {}

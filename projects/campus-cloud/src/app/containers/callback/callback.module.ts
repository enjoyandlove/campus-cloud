import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
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
  FeedbackOrientationEventComponent,
  FeedbackAlreadySubmittedComponent
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

import {
  WebFormComponent,
  StartComponent,
  FormBlockComponent,
  UnavailableFormComponent,
  WebFormService,
  webFormReducer,
  webFormErrorReducer
} from './web-form';

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
    FeedbackOrientationEventComponent,
    FeedbackAlreadySubmittedComponent,
    WebFormComponent,
    StartComponent,
    FormBlockComponent,
    UnavailableFormComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    CallbackRoutingModule,
    StoreModule.forFeature('webForm', webFormReducer),
    StoreModule.forFeature('webFormError', webFormErrorReducer)
  ],

  providers: [
    AuthService,
    CheckinService,
    FeedbackService,
    CheckinUtilsService,
    WebFormService,
    { provide: ApiService, useClass: CallbackService }
  ]
})
export class CallbackModule {}

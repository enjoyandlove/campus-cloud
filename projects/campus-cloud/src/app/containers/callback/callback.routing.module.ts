import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import { pageTitle } from '@campus-cloud/shared/constants';
import { AdminInviteComponent } from './admin-invite';

import {
  CheckinEventsComponent,
  CheckinServiceComponent,
  CheckinOrientationEventsComponent
} from './checkin';
import {
  FeedbackEventComponent,
  FeedbackServiceComponent,
  FeedbackOrientationEventComponent
} from './feedback';
const appRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    children: [
      {
        path: 'password-reset/:key',
        component: CallbackPasswordResetComponent,
        data: { zendesk: 'password', title: pageTitle.RESET_PASSWORD }
      },

      {
        path: 'invite/:key',
        component: AdminInviteComponent,
        data: { zendesk: 'password', title: pageTitle.CREATE_ACCOUNT }
      },

      {
        path: 'feedback/e/:event',
        component: FeedbackEventComponent,
        data: { zendesk: 'assessment', title: pageTitle.WEB_CHECK_IN }
      },
      {
        path: 'feedback/o/:event',
        component: FeedbackOrientationEventComponent,
        data: { zendesk: 'assessment', title: pageTitle.WEB_CHECK_IN }
      },
      {
        path: 'feedback/s/:service',
        component: FeedbackServiceComponent,
        data: { zendesk: 'assessment', title: pageTitle.WEB_CHECK_IN }
      },

      {
        path: 'checkin/e/:event',
        component: CheckinEventsComponent,
        data: { zendesk: 'assessment', title: pageTitle.WEB_CHECK_IN }
      },
      {
        path: 'checkin/o/:event',
        component: CheckinOrientationEventsComponent,
        data: { zendesk: 'assessment' }
      },
      {
        path: 'checkin/s/:service/:provider',
        component: CheckinServiceComponent,
        data: { zendesk: 'assessment', title: pageTitle.WEB_CHECK_IN }
      },

      { path: '**', redirectTo: '/login' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CallbackRoutingModule {}

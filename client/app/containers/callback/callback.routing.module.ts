import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import { CheckinEventsComponent, CheckinServiceComponent } from './checkin';

import { FeedbackEventComponent, FeedbackServiceComponent } from './feedback';

import { AdminInviteComponent } from './admin-invite';

const appRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    children: [
      {
        path: 'password-reset/:key',
        data: { zendesk: 'password reset' },
        component: CallbackPasswordResetComponent,
      },

      {
        path: 'invite/:key',
        component: AdminInviteComponent,
        data: { zendesk: 'create account' },
      },

      {
        path: 'feedback/e/:event',
        component: FeedbackEventComponent,
        data: { zendesk: 'event feedback' },
      },
      {
        path: 'feedback/s/:service',
        component: FeedbackServiceComponent,
        data: { zendesk: 'service feedback' },
      },

      {
        path: 'checkin/e/:event',
        component: CheckinEventsComponent,
        data: { zendesk: 'event checkin' },
      },
      {
        path: 'checkin/s/:service/:provider',
        data: { zendesk: 'service checkin' },
        component: CheckinServiceComponent,
      },

      { path: '**', redirectTo: '/login' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CallbackRoutingModule {}

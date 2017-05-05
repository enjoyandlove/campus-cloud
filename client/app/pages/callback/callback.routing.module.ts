import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import {
  CheckinEventsComponent,
  CheckinServiceComponent
} from './checkin';

import {
  FeedbackEventComponent,
  FeedbackServiceComponent
} from './feedback';

const appRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    children: [
      { path: 'password-reset', component: CallbackPasswordResetComponent },

      { path: 'feedback/e/:event', component: FeedbackEventComponent },
      { path: 'feedback/s/:service', component: FeedbackServiceComponent },

      { path: 'checkin/e/:event', component: CheckinEventsComponent },
      { path: 'checkin/s/:service/:provider', component: CheckinServiceComponent },
    ]
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CallbackRoutingModule {}

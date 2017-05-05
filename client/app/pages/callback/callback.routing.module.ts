import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

import {
  CheckinEventsComponent,
  CheckinServiceComponent
} from './checkin';

const appRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    children: [
      { path: 'password-reset', component: CallbackPasswordResetComponent },

      { path: 'checkin/service', component: CheckinServiceComponent },

      { path: 'checkin/event', component: CheckinEventsComponent }
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

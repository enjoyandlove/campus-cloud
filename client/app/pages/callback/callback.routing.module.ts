import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckinServiceComponent } from './checkin';
import { CallbackComponent } from './callback.component';
import { CallbackPasswordResetComponent } from './password-reset';

const appRoutes: Routes = [
  {
    path: '',
    component: CallbackComponent,
    children: [
      { path: 'password-reset', component: CallbackPasswordResetComponent },

      { path: 'checkin/services', component: CheckinServiceComponent }
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

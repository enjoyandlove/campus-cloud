import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { metaTitle } from '@shared/constants';
import { ChangePasswordComponent } from './change-password';

const appRoutes: Routes = [
  { path: '', redirectTo: '../manage/events', pathMatch: 'full' },

  {
    path: 'change-password',
    data: { zendesk: 'password', title: metaTitle.CHANGE_PASSWORD },
    component: ChangePasswordComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

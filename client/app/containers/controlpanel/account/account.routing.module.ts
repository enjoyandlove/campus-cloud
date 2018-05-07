import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';
import { ChangePasswordComponent } from './change-password';

const appRoutes: Routes = [
  { path: '', redirectTo: '../manage/events', pathMatch: 'full' },

  {
    path: 'change-password',
    data: { zendesk: 'password' },
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

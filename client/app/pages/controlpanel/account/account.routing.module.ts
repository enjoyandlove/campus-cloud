import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordComponent } from './change-password';


const appRoutes: Routes = [
  { path: '', redirectTo: '../manage/events', pathMatch: 'full' },


  { path: 'change-password', component: ChangePasswordComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}

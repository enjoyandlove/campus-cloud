import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AuthGuard, PrivilegesGuard } from '../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PrivilegesGuard],
    children: [
      {
        path: 'team',
        loadChildren: './team/team.module#TeamModule'
      },
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
export class SettingsRoutingModule { }

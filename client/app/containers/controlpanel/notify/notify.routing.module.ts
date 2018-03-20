import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { NotifyComponent } from './notify.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'announcements', pathMatch: 'full' },

  {
    path: '',
    component: NotifyComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'announcements',
        loadChildren:
          './announcements/announcements.module#AnnouncementsModule',
      },

      {
        path: 'templates',
        loadChildren: './templates/templates.module#TemplatesModule',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class NotifyRoutingModule {}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { NotifyComponent } from './notify.component';
import { CP_PRIVILEGES_MAP } from '@shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'announcements', pathMatch: 'full' },

  {
    path: '',
    component: NotifyComponent,
    children: [
      {
        path: 'announcements',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'announcements', privilege: CP_PRIVILEGES_MAP.campus_announcements },
        loadChildren: './announcements/announcements.module#AnnouncementsModule'
      },

      {
        path: 'templates',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'templates', privilege: CP_PRIVILEGES_MAP.campus_announcements },
        loadChildren: './templates/templates.module#TemplatesModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class NotifyRoutingModule {}

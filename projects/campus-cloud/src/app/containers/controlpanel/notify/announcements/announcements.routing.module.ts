import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AnnouncementSentComponent } from './sent';
import { AnnouncementScheduledComponent } from './scheduled';
import { ScheduledEditComponent } from './scheduled-edit/scheduled-edit.component';
import { AnnouncementsComposeComponent } from './compose/announcements-compose.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sent' },

  {
    path: '',
    children: [
      {
        path: 'sent',
        component: AnnouncementSentComponent,
        data: { zendesk: 'notify', amplitude: 'Sent' }
      },
      {
        path: 'scheduled',
        component: AnnouncementScheduledComponent,
        data: { zendesk: 'scheduled announcement', amplitude: 'Scheduled' }
      },
      {
        path: 'scheduled/edit/:announcementId',
        component: ScheduledEditComponent,
        data: { zendesk: 'scheduled announcement', amplitude: 'Scheduled' }
      },
      {
        path: 'compose',
        component: AnnouncementsComposeComponent,
        data: { zendesk: 'notify', amplitude: 'Scheduled' }
      },
      {
        path: 'integrations',
        data: { amplitude: 'Integrations' },
        loadChildren: () =>
          import('./integrations/announcements.integrations.module').then(
            (m) => m.AnnouncementIntegrationsModule
          )
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AnnouncementsRoutingModule {}

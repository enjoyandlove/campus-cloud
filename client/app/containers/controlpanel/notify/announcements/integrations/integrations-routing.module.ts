import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { AnnouncementsIntegrationListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: AnnouncementsIntegrationListComponent,
    data: { zendesk: 'annoucements integration' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementIntegrationsRoutingModule {}

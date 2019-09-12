import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PrivilegesGuard } from '../../../../../config/guards';
import { EventsIntegrationsListComponent } from './list/integrations-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: EventsIntegrationsListComponent,
    data: { zendesk: 'events integration', amplitude: 'IGNORE' }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventIntegrationRoutingModule {}

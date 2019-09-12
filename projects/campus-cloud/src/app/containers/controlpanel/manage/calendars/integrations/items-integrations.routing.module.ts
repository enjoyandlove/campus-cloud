import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { ItemsIntegrationsListComponent } from './list/integrations-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: ItemsIntegrationsListComponent,
    data: { zendesk: 'events integration', title: pageTitle.MANAGE_CALENDARS, amplitude: 'IGNORE' }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsIntegrationRoutingModule {}

import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { metaTitle } from '@shared/constants';
import { PrivilegesGuard } from '@app/config/guards';
import { ItemsIntegrationsListComponent } from './list/integrations-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: ItemsIntegrationsListComponent,
    data: { zendesk: 'events integration', title: metaTitle.MANAGE_CALENDARS }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsIntegrationRoutingModule {}

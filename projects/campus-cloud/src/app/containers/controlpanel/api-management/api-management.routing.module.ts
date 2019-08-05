import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { ApiManagementComponent } from './api-management.component';
import { ApiListComponent } from '@controlpanel/api-management/list';

const appRoutes: Routes = [
  {
    path: '',
    component: ApiManagementComponent,
    children: [
      {
        path: '',
        canActivate: [PrivilegesGuard],
        component: ApiListComponent,
        data: { zendesk: 'API Management', title: pageTitle.API_MANAGEMENT }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ApiManagementRoutingModule {}

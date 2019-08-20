import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiListComponent } from './list';
import { ApiCreateComponent } from './create';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { ApiManagementComponent } from './api-management.component';
import { RouteNavigationGuard } from '@controlpanel/api-management/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: ApiManagementComponent,
    children: [
      {
        path: '',
        component: ApiListComponent,
        canActivate: [PrivilegesGuard],
        canDeactivate: [RouteNavigationGuard],
        data: { zendesk: 'API Management', title: pageTitle.API_MANAGEMENT }
      },
      {
        path: 'create',
        canActivate: [PrivilegesGuard],
        component: ApiCreateComponent,
        data: { zendesk: 'API Management', title: pageTitle.API_MANAGEMENT }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [RouteNavigationGuard]
})
export class ApiManagementRoutingModule {}

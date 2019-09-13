import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiListComponent } from './list';
import { ApiCreateComponent } from './create';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { ApiManagementComponent } from './api-management.component';
import { RouteNavigationGuard } from '@controlpanel/api-management/guards';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: ApiManagementComponent,
    children: [
      {
        path: '',
        component: ApiListComponent,
        canActivate: [PrivilegesGuard],
        canDeactivate: [RouteNavigationGuard],
        data: {
          zendesk: 'API Management',
          title: pageTitle.API_MANAGEMENT,
          privilege: CP_PRIVILEGES_MAP.api_management
        }
      },
      {
        path: 'create',
        canActivate: [PrivilegesGuard],
        component: ApiCreateComponent,
        data: {
          zendesk: 'API Management',
          title: pageTitle.API_MANAGEMENT,
          privilege: CP_PRIVILEGES_MAP.api_management
        }
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

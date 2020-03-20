import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiListComponent } from './list';
import { ApiCreateComponent } from './create';
import { RouteNavigationGuard } from '@controlpanel/campus-app-management/api-management/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: ApiListComponent,
    canDeactivate: [RouteNavigationGuard],
    data: {
      zendesk: 'API Management',
      amplitude: 'API Management'
    }
  },
  {
    path: 'create',
    component: ApiCreateComponent,
    data: {
      zendesk: 'API Management',
      amplitude: 'API Management'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [RouteNavigationGuard]
})
export class ApiManagementRoutingModule {}

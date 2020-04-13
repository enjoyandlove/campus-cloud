import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

import { CampusAppManagementComponent } from './campus-app-management.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'api-management', pathMatch: 'full' },
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: CampusAppManagementComponent,
    children: [
      {
        path: 'api-management',
        canActivate: [PrivilegesGuard],
        loadChildren: () =>
          import('./api-management/api-management.module').then((m) => m.ApiManagementModule),
        data: {
          zendesk: 'API Management',
          title: pageTitle.API_MANAGEMENT,
          privilege: CP_PRIVILEGES_MAP.campus_app_management
        }
      },
      {
        path: 'terms-of-use',
        canActivate: [PrivilegesGuard],
        loadChildren: () =>
          import('./terms-of-use/terms-of-use.module').then((m) => m.TermsOfUseModule),
        data: {
          zendesk: 'Terms of Use',
          title: pageTitle.TERMS_OF_USE,
          privilege: CP_PRIVILEGES_MAP.campus_app_management
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CampusAppManagementRoutingModule {}

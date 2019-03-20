import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { CP_PRIVILEGES_MAP } from '@shared/constants';
import { CustomiseComponent } from './customise.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'experiences', pathMatch: 'full' },
  {
    path: '',
    component: CustomiseComponent,
    children: [
      {
        path: 'experiences',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'experiences', privilege: CP_PRIVILEGES_MAP.app_customization },
        loadChildren: './personas/personas.module#PersonasModule'
      },
      {
        path: 'branding',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'experiences', privilege: CP_PRIVILEGES_MAP.app_customization },
        loadChildren: './banner/banner.module#BannerModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CustomiseRoutingModule {}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CustomiseComponent } from './customise.component';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'branding', pathMatch: 'full' },
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: CustomiseComponent,
    children: [
      {
        path: 'experiences',
        canActivate: [PrivilegesGuard],
        loadChildren: () => import('./personas/personas.module').then((m) => m.PersonasModule),
        data: {
          zendesk: 'experiences',
          amplitude: 'App Experiences',
          title: pageTitle.STUDIO_EXPERIENCE,
          privilege: CP_PRIVILEGES_MAP.app_customization
        }
      },
      {
        path: 'branding',
        canActivate: [PrivilegesGuard],
        loadChildren: () => import('./banner/banner.module').then((m) => m.BannerModule),
        data: {
          zendesk: 'experiences',
          amplitude: 'Branding',
          title: pageTitle.STUDION_BRANDING,
          privilege: CP_PRIVILEGES_MAP.app_customization
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CustomiseRoutingModule {}

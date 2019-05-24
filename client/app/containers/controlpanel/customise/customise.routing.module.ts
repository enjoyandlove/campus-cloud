import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { CustomiseComponent } from './customise.component';
import { CP_PRIVILEGES_MAP, metaTitle } from '@shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'branding', pathMatch: 'full' },
  {
    path: '',
    component: CustomiseComponent,
    children: [
      {
        path: 'experiences',
        canActivate: [PrivilegesGuard],
        loadChildren: './personas/personas.module#PersonasModule',
        data: {
          zendesk: 'experiences',
          title: metaTitle.STUDIO_EXPERIENCE,
          privilege: CP_PRIVILEGES_MAP.app_customization
        }
      },
      {
        path: 'branding',
        canActivate: [PrivilegesGuard],
        loadChildren: './banner/banner.module#BannerModule',
        data: {
          zendesk: 'experiences',
          title: metaTitle.STUDION_BRANDING,
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

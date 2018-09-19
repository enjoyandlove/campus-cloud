import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { isProd } from './../../../config/env';
import { CustomiseComponent } from './customise.component';
import { AuthGuard, PrivilegesGuard } from '../../../config/guards';

const appRoutes: Routes = [
  { path: '', redirectTo: isProd ? 'branding' : 'experiences', pathMatch: 'full' },
  {
    path: '',
    component: CustomiseComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PrivilegesGuard],
    children: [
      {
        path: 'experiences',
        data: { zendesk: 'customize' },
        loadChildren: './personas/personas.module#PersonasModule'
      },
      {
        path: 'branding',
        data: { zendesk: 'customize' },
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomiseComponent } from './customise.component';
import { AuthGuard, PrivilegesGuard } from '../../../config/guards';

const appRoutes: Routes = [
  { path: '', redirectTo: 'banner', pathMatch: 'full' },
  {
    path: '',
    component: CustomiseComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PrivilegesGuard],
    children: [
      {
        path: 'banner',
        data: { zendesk: 'customize' },
        loadChildren: './banner/banner.module#BannerModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CustomiseRoutingModule {}

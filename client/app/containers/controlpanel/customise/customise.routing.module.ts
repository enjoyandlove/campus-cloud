import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';
import { CustomiseComponent } from './customise.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'banner', pathMatch: 'full' },
  {
    path: '',
    component: CustomiseComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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

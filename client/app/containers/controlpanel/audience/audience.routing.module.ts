import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AudienceListComponent } from './list';
import { AudienceComponent } from './audience.component';
import { AuthGuard, PrivilegesGuard } from '../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: AudienceComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PrivilegesGuard],
    children: [
      {
        path: '',
        data: { zendesk: 'audience' },
        component: AudienceListComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AudienceRoutingModule {}

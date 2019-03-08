import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AudienceListComponent } from './list';
import { PrivilegesGuard } from '@app/config/guards';
import { AudienceComponent } from './audience.component';
import { CP_PRIVILEGES_MAP } from '@app/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    component: AudienceComponent,
    children: [
      {
        path: '',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'audience', privilege: CP_PRIVILEGES_MAP.audience },
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

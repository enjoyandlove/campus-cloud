import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AudienceListComponent } from './list';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { AudienceComponent } from './audience.component';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: AudienceComponent,
    children: [
      {
        path: '',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'audience',
          title: pageTitle.AUDIENCES,
          privilege: CP_PRIVILEGES_MAP.audience
        },
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

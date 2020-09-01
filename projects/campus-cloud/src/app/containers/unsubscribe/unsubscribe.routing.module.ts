import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UnsubscribeGenericComponent } from './generic';
import { pageTitle } from '@campus-cloud/shared/constants';
import { UnsubscribeComponent } from './unsubscribe.component';

const appRoutes: Routes = [
  {
    path: '',
    component: UnsubscribeComponent,
    children: [
      {
        path: 'feeds/:schoolId/:adminId',
        component: UnsubscribeGenericComponent,
        data: { zendesk: 'unsubscribe feeds', title: pageTitle.UNSUBSCRIBE_MAIL }
      },
      {
        path: 'cases/:schoolId/:adminId',
        component: UnsubscribeGenericComponent,
        data: { zendesk: 'unsubscribe cases', title: pageTitle.UNSUBSCRIBE_MAIL }
      },

      { path: '**', redirectTo: '/login' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class UnsubscribeRoutingModule {}

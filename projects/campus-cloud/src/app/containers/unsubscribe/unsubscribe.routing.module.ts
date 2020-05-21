import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UnsubscribeFeedsComponent } from './feeds';
import { pageTitle } from '@campus-cloud/shared/constants';
import { UnsubscribeComponent } from './unsubscribe.component';

const appRoutes: Routes = [
  {
    path: '',
    component: UnsubscribeComponent,
    children: [
      {
        path: 'feeds/:schoolId/:adminId',
        component: UnsubscribeFeedsComponent,
        data: { zendesk: 'unsubscribe feeds', title: pageTitle.UNSUBSCRIBE_MAIL }
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

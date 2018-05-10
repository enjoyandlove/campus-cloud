import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EngagementResolver } from './engagement.resolver';

import { EngagementComponent } from './engagement.component';

const engagementRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'Assessment Dashboard' },
    component: EngagementComponent,
    resolve: {
      data: EngagementResolver
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(engagementRoutes)],
  exports: [RouterModule],
  providers: [EngagementResolver]
})
export class EngagementRoutingModule {}

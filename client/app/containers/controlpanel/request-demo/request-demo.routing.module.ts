import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestDemoAssessmentComponent } from './request-demo-assessment';

const appRoutes: Routes = [
  {
    path: 'assess',
    data: { zendesk: 'assessment' },
    component: RequestDemoAssessmentComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class RequestDemoRoutingModule {}

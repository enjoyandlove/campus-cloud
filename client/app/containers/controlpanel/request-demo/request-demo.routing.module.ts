import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { RequestDemoAssessmentComponent }  from './request-demo-assessment';

const appRoutes: Routes = [
  {
    path: 'assess',
    canActivate: [ AuthGuard ],
    component: RequestDemoAssessmentComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RequestDemoRoutingModule {}

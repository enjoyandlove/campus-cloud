import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AuthGuard } from '../../../../config/guards';

import { EngagementComponent } from './engagement.component';


const appRoutes: Routes = [
  {
    path: '',
    component: EngagementComponent
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
export class EngagementRoutingModule { }

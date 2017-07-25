import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EngagementResolver } from './engagement.resolver';

import { EngagementComponent } from './engagement.component';


const appRoutes: Routes = [
  {
    path: '',
    component: EngagementComponent,
    resolve: {
      data: EngagementResolver
    }
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [ EngagementResolver ]
})
export class EngagementRoutingModule { }

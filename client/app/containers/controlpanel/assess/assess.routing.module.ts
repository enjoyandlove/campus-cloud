import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { AssessComponent } from './assess.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'dashboard', loadChildren: './engagement/engagement.module#EngagementModule' },
    ]
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
export class AssessRoutingModule {}

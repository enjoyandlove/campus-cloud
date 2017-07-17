import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { AssessComponent } from './assess.component';

import { EngagementComponent } from './engagement/engagement.component';


const appRoutes: Routes = [
  // { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: EngagementComponent },

      // { path: 'students', loadChildren: './events/events.module#EventsModule' },
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

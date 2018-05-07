import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsInfoComponent } from '../info';
import { AthleticsWallComponent } from '../wall';

import { AthleticsDetailsComponent } from './athletics-details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: AthleticsDetailsComponent,
    children: [
      { path: 'info', component: AthleticsInfoComponent },

      { path: 'feeds', component: AthleticsWallComponent },

      {
        path: 'events',
        loadChildren: '../events/athletics-events.module#AthleticsEventsModule'
      },

      {
        path: 'members',
        loadChildren: '../members/athletics-members.module#AthleticsMembersModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsDetailsRoutingModule {}

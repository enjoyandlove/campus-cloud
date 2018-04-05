import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationInfoComponent } from '../info';
import { OrientationDetailsComponent } from './orientation-details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationDetailsComponent,
    children: [
      { path: 'info', component: OrientationInfoComponent },

    //  { path: 'feeds', component: ClubsWallComponent },

      {
         path: 'events',
         loadChildren: '../events/orientation-events.module#OrientationEventsModule',
       },

     /*{
         path: 'members',
         loadChildren: '../members/members.module#ClubsMembersModule',
       },*/
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationDetailsRoutingModule {}

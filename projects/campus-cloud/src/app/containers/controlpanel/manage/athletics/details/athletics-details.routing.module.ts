import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsInfoComponent } from '../info';
import { AthleticsWallComponent } from '../wall';

import { pageTitle } from '@campus-cloud/shared/constants';
import { AthleticsDetailsComponent } from './athletics-details.component';

const appRoutes: Routes = [
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: AthleticsDetailsComponent,
    children: [
      {
        path: 'info',
        component: AthleticsInfoComponent,
        data: { title: pageTitle.MANAGE_ATHLETICS, amplitude: 'Info' }
      },

      {
        path: 'feeds',
        component: AthleticsWallComponent,
        data: { title: pageTitle.MANAGE_ATHLETICS, amplitude: 'Walls' }
      },

      {
        path: 'events',
        data: { title: pageTitle.MANAGE_ATHLETICS, amplitude: 'Events' },
        loadChildren: () =>
          import('../events/athletics-events.module').then((m) => m.AthleticsEventsModule)
      },

      {
        path: 'members',
        data: { title: pageTitle.MANAGE_ATHLETICS, amplitude: 'Members' },
        loadChildren: () =>
          import('../members/athletics-members.module').then((m) => m.AthleticsMembersModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsDetailsRoutingModule {}

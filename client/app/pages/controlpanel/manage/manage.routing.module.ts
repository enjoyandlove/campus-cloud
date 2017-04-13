import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { ManageComponent } from './manage.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: ManageComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'events', loadChildren: './events/events.module#EventsModule' },

      { path: 'services', loadChildren: './services/services.module#ServicesModule' },

      { path: 'links', loadChildren: './links/links.module#LinksModule' },

      { path: 'feeds', loadChildren: './feeds/feeds.module#FeedsModule' },

      { path: 'clubs', loadChildren: './clubs/clubs.module#ClubsModule' },

      {
        path: 'customization',
        loadChildren: './customization/customization.module#CustomizationModule'
      },
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
export class ManageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { ManageComponent } from './manage.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: ManageComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'events', loadChildren: './events/events.module#EventsModule' },

      {
        path: 'services',
        loadChildren: './services/services.module#ServicesModule',
      },

      { path: 'clubs', loadChildren: './clubs/clubs.module#ClubsModule' },

      { path: 'athletics', loadChildren: './athletics/athletics.module#AthleticsModule' },

      { path: 'links', loadChildren: './links/links.module#LinksModule' },

      { path: 'feeds', loadChildren: './feeds/feeds.module#FeedsModule' },

      { path: 'clubs', loadChildren: './clubs/clubs.module#ClubsModule' },

      { path: 'lists', loadChildren: './lists/lists.module#ListsModule' },

      { path: 'calendars', loadChildren: './calendars/calendars.module#CalendarsModule' },

      {
        path: 'locations',
        loadChildren: './locations/locations.module#LocationsModule',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}

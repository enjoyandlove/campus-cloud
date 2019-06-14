import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { ManageComponent } from './manage.component';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants/privileges';
import { CanDeactivateDining } from './dining/guards/dining-guard';
import { CanDeactivateLocations } from './locations/locations.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: 'events',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'events', privilege: CP_PRIVILEGES_MAP.events },
        loadChildren: './events/events.module#EventsModule'
      },

      {
        path: 'services',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'services', privilege: CP_PRIVILEGES_MAP.services },
        loadChildren: './services/services.module#ServicesModule'
      },

      {
        path: 'clubs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'clubs', privilege: CP_PRIVILEGES_MAP.clubs },
        loadChildren: './clubs/clubs.module#ClubsModule'
      },

      {
        path: 'athletics',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'athletics', privilege: CP_PRIVILEGES_MAP.athletics },
        loadChildren: './athletics/athletics.module#AthleticsModule'
      },

      {
        path: 'links',
        redirectTo: ''
      },

      {
        path: 'feeds',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'walls', privilege: CP_PRIVILEGES_MAP.moderation },
        loadChildren: './feeds/feeds.module#FeedsModule'
      },

      {
        path: 'clubs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'clubs', privilege: CP_PRIVILEGES_MAP.clubs },
        loadChildren: './clubs/clubs.module#ClubsModule'
      },

      {
        path: 'calendars',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'calendars', privilege: CP_PRIVILEGES_MAP.calendar },
        loadChildren: './calendars/calendars.module#CalendarsModule'
      },

      {
        path: 'locations',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'locations', privilege: CP_PRIVILEGES_MAP.campus_maps },
        canDeactivate: [CanDeactivateLocations],
        loadChildren: './locations/locations.module#LocationsModule'
      },

      {
        path: 'dining',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'dining', privilege: CP_PRIVILEGES_MAP.dining },
        canDeactivate: [CanDeactivateDining],
        loadChildren: './dining/dining.module#DiningModule'
      },

      {
        path: 'orientation',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'orientation', privilege: CP_PRIVILEGES_MAP.orientation },
        loadChildren: './orientation/orientation.module#OrientationModule'
      },

      {
        path: 'jobs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'jobs', privilege: CP_PRIVILEGES_MAP.jobs },
        loadChildren: './jobs/jobs.module#JobsModule'
      },

      {
        path: 'deals',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'deals', privilege: CP_PRIVILEGES_MAP.deals },
        loadChildren: './deals/deals.module#DealsModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanDeactivateLocations, CanDeactivateDining]
})
export class ManageRoutingModule {}

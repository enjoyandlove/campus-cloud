import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ManageComponent } from './manage.component';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CanDeactivateDining } from './dining/guards/dining-guard';
import { CanDeactivateLocations } from './locations/locations.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: ManageComponent,
    data: { amplitude: 'IGNORE' },
    children: [
      {
        path: 'events',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'events', amplitude: 'Events', privilege: CP_PRIVILEGES_MAP.events },
        loadChildren: () => import('./events/events.module').then((m) => m.EventsModule)
      },

      {
        path: 'services',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'services', privilege: CP_PRIVILEGES_MAP.services, amplitude: 'Services' },
        loadChildren: () => import('./services/services.module').then((m) => m.ServicesModule)
      },

      {
        path: 'clubs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'clubs', privilege: CP_PRIVILEGES_MAP.clubs, amplitude: 'Clubs' },
        loadChildren: () => import('./clubs/clubs.module').then((m) => m.ClubsModule)
      },

      {
        path: 'athletics',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'athletics',
          amplitude: 'Athletics',
          privilege: CP_PRIVILEGES_MAP.athletics
        },
        loadChildren: () => import('./athletics/athletics.module').then((m) => m.AthleticsModule)
      },

      {
        path: 'feeds',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'walls', privilege: CP_PRIVILEGES_MAP.moderation, amplitude: 'Walls' },
        loadChildren: () => import('./feeds/feeds.module').then((m) => m.FeedsModule)
      },

      {
        path: 'clubs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'clubs', privilege: CP_PRIVILEGES_MAP.clubs },
        loadChildren: () => import('./clubs/clubs.module').then((m) => m.ClubsModule)
      },

      {
        path: 'calendars',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'calendars',
          amplitude: 'Calendars',
          privilege: CP_PRIVILEGES_MAP.calendar
        },
        loadChildren: () => import('./calendars/calendars.module').then((m) => m.CalendarsModule)
      },

      {
        path: 'locations',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'locations',
          amplitude: 'Locations',
          privilege: CP_PRIVILEGES_MAP.campus_maps
        },
        canDeactivate: [CanDeactivateLocations],
        loadChildren: () => import('./locations/locations.module').then((m) => m.LocationsModule)
      },

      {
        path: 'dining',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'dining', privilege: CP_PRIVILEGES_MAP.dining, amplitude: 'Dining' },
        canDeactivate: [CanDeactivateDining],
        loadChildren: () => import('./dining/dining.module').then((m) => m.DiningModule)
      },

      {
        path: 'orientation',
        canActivate: [PrivilegesGuard],
        data: {
          zendesk: 'orientation',
          amplitude: 'Orientation',
          privilege: CP_PRIVILEGES_MAP.orientation
        },
        loadChildren: () =>
          import('./orientation/orientation.module').then((m) => m.OrientationModule)
      },

      {
        path: 'jobs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'jobs', privilege: CP_PRIVILEGES_MAP.jobs, amplitude: 'Jobs' },
        loadChildren: () => import('./jobs/jobs.module').then((m) => m.JobsModule)
      },

      {
        path: 'deals',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'deals', privilege: CP_PRIVILEGES_MAP.deals, amplitude: 'Deals' },
        loadChildren: () => import('./deals/deals.module').then((m) => m.DealsModule)
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

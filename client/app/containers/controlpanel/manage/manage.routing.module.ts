import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { ManageComponent } from './manage.component';
import { CP_PRIVILEGES_MAP } from '@shared/constants/privileges';
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
        loadChildren: () => import('./events/events.module').then((m) => m.EventsModule)
      },

      {
        path: 'services',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'services', privilege: CP_PRIVILEGES_MAP.services },
        loadChildren: () => import('./services/services.module').then((m) => m.ServicesModule)
      },

      {
        path: 'clubs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'clubs', privilege: CP_PRIVILEGES_MAP.clubs },
        loadChildren: () => import('./clubs/clubs.module').then((m) => m.ClubsModule)
      },

      {
        path: 'athletics',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'athletics', privilege: CP_PRIVILEGES_MAP.athletics },
        loadChildren: () => import('./athletics/athletics.module').then((m) => m.AthleticsModule)
      },

      {
        path: 'links',
        redirectTo: ''
      },

      {
        path: 'feeds',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'walls', privilege: CP_PRIVILEGES_MAP.moderation },
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
        data: { zendesk: 'calendars', privilege: CP_PRIVILEGES_MAP.calendar },
        loadChildren: () => import('./calendars/calendars.module').then((m) => m.CalendarsModule)
      },

      {
        path: 'locations',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'locations', privilege: CP_PRIVILEGES_MAP.campus_maps },
        canDeactivate: [CanDeactivateLocations],
        loadChildren: () => import('./locations/locations.module').then((m) => m.LocationsModule)
      },

      {
        path: 'dining',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'dining', privilege: CP_PRIVILEGES_MAP.dining },
        canDeactivate: [CanDeactivateDining],
        loadChildren: () => import('./dining/dining.module').then((m) => m.DiningModule)
      },

      {
        path: 'orientation',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'orientation', privilege: CP_PRIVILEGES_MAP.orientation },
        loadChildren: () =>
          import('./orientation/orientation.module').then((m) => m.OrientationModule)
      },

      {
        path: 'jobs',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'jobs', privilege: CP_PRIVILEGES_MAP.jobs },
        loadChildren: () => import('./jobs/jobs.module').then((m) => m.JobsModule)
      },

      {
        path: 'deals',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'deals', privilege: CP_PRIVILEGES_MAP.deals },
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

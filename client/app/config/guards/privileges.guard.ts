import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  PRIMARY_OUTLET
} from '@angular/router';

import { CPSession } from '../../session';
import { CP_PRIVILEGES_MAP } from './../../shared/constants';
import { AdminService, SchoolService, StoreService, ZendeskService } from '../../shared/services';

import {
  canAccountLevelReadResource,
  canSchoolReadResource
} from './../../shared/utils/privileges';

@Injectable()
export class PrivilegesGuard implements CanActivate, CanActivateChild {
  constructor(
    public router: Router,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService,
    public zendeskService: ZendeskService
  ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    this.setZendesk(childRoute.data);

    if (childRoute.url.length) {
      return this.hasPrivileges(childRoute.url[0].path);
    }

    return true;
  }

  canActivate(activatedRoute, state) {
    this.setZendesk(activatedRoute.data);

    if (this.getParentModuleNameByRouteConfig(state.url)) {
      return this.hasPrivileges(this.getParentModuleNameByRouteConfig(state.url));
    }

    return true;
  }

  hasPrivileges(route) {
    const protectedRoutes = [
      'jobs',
      'deals',
      'events',
      'feeds',
      'clubs',
      'athletics',
      'calendars',
      'services',
      'lists',
      'links',
      'locations',
      'announcements',
      'templates',
      'banner',
      'dashboard',
      'students',
      'orientation'
    ];

    const routeToPrivilege = {
      events: CP_PRIVILEGES_MAP.events,

      feeds: CP_PRIVILEGES_MAP.moderation,

      clubs: CP_PRIVILEGES_MAP.clubs,

      athletics: CP_PRIVILEGES_MAP.athletics,

      services: CP_PRIVILEGES_MAP.services,

      lists: CP_PRIVILEGES_MAP.campus_announcements,

      calendars: CP_PRIVILEGES_MAP.calendar,

      links: CP_PRIVILEGES_MAP.links,

      announcements: CP_PRIVILEGES_MAP.campus_announcements,

      locations: CP_PRIVILEGES_MAP.campus_maps,

      templates: CP_PRIVILEGES_MAP.campus_announcements,

      banner: CP_PRIVILEGES_MAP.app_customization,

      dashboard: CP_PRIVILEGES_MAP.assessment,

      students: CP_PRIVILEGES_MAP.assessment,

      orientation: CP_PRIVILEGES_MAP.orientation,

      jobs: CP_PRIVILEGES_MAP.jobs,

      deals: CP_PRIVILEGES_MAP.deals,
    };

    if (route) {
      if (protectedRoutes.includes(route)) {
        let canAccess;

        const schoolLevel = canSchoolReadResource(this.session.g, routeToPrivilege[route]);
        const accountLevel = canAccountLevelReadResource(this.session.g, routeToPrivilege[route]);

        canAccess = schoolLevel || accountLevel;

        if (!canAccess) {
          this.router.navigate(['/dashboard']);
        }

        return canAccess;
      }
    }

    return true;
  }

  private setZendesk(routeObj) {
    if ('zendesk' in routeObj) {
      this.zendeskService.setHelpCenterSuggestions({
        labels: [routeObj['zendesk']]
      });
    }
  }

  getParentModuleNameByRouteConfig(url) {
    const tree = this.router.parseUrl(url);
    const children = tree.root.children[PRIMARY_OUTLET];
    const segments = children.segments;

    return segments[1].path;
  }
}

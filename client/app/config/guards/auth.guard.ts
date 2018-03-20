import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  PRIMARY_OUTLET
} from '@angular/router';

import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import * as Raven from 'raven-js';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
import { base64 } from './../../shared/utils/encrypt/encrypt';
import { CP_PRIVILEGES_MAP } from './../../shared/constants';
import {
  AdminService,
  SchoolService,
  StoreService,
  ZendeskService
} from '../../shared/services';

/**
 * Guard to check if user is authenticated
 */

import {
  canAccountLevelReadResource,
  canSchoolReadResource
} from './../../shared/utils/privileges';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    public router: Router,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService,
    public zendeskService: ZendeskService
  ) {}

  preLoadUser(): Promise<any> {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    return this.adminService
      .getAdmins(1, 1, search)
      .map((users) => {
        this.session.g.set('user', users[0]);
        this.setUserContext();

        return users;
      })
      .toPromise();
  }

  preLoadSchool(route: ActivatedRouteSnapshot): Promise<any> {
    return this.schoolService
      .getSchools()
      .map((schools) => {
        let schoolIdInUrl;
        let schoolObjFromUrl;
        const storedSchool = JSON.parse(
          appStorage.get(appStorage.keys.DEFAULT_SCHOOL)
        );

        try {
          schoolIdInUrl = base64.decode(route.queryParams.school);
        } catch (error) {
          schoolIdInUrl = null;
        }

        if (schoolIdInUrl) {
          Object.keys(schools).map((key: any) => {
            if (schools[key].id === +schoolIdInUrl) {
              schoolObjFromUrl = schools[key];
            }
          });
        }

        this.session.g.set('schools', schools);

        this.session.g.set(
          'school',
          storedSchool || schoolObjFromUrl || schools[0]
        );
      })
      .toPromise();
  }

  fetcthStores(): Promise<any> {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    return this.storeService.getStores(search).toPromise();
  }

  setDefaultHost(stores): Promise<null> {
    let defaultHost = null;

    return new Promise((resolve) => {
      const schoolDefaultHost = this.session.g.get('school')
        .main_union_store_id;

      stores.map((store) => {
        if (store.value === schoolDefaultHost) {
          defaultHost = store;
        }
      });

      this.session.defaultHost = defaultHost;
      resolve();
    });
  }

  private setZendesk(routeObj) {
    if ('zendesk' in routeObj) {
      this.zendeskService.setHelpCenterSuggestions({
        labels: [routeObj['zendesk']]
      });
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.setZendesk(childRoute.data);

    const protectedRoutes = [
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
      'orientation',
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
    };

    if (childRoute.url.length) {
      const path = childRoute.url[0].path;

      if (this.whiteListedRoutes(routeToPrivilege, path, state.url)) {
        return true;
      }

      if (protectedRoutes.includes(path)) {
        let canAccess;

        const schoolLevel = canSchoolReadResource(
          this.session.g,
          routeToPrivilege[path]
        );
        const accountLevel = canAccountLevelReadResource(
          this.session.g,
          routeToPrivilege[path]
        );

        canAccess = schoolLevel || accountLevel;

        if (!canAccess) {
          this.router.navigate(['/dashboard']);
        }

        return canAccess;
      }
    }

    return true;
  }

  whiteListedRoutes(routeToPrivilege, path, url) {
    const parentPath = this.getUrlSegments(url);
    const routes = {
      orientation: ['events', 'feeds', 'members'],
    };

    const schoolLevel = canSchoolReadResource(
      this.session.g,
      routeToPrivilege[parentPath]
    );

    if (schoolLevel) {
      if (routes.hasOwnProperty(parentPath)) {
       if (routes[parentPath].includes(path)) {
         return true;
       }
      }
    }

    return false;
  }

  getUrlSegments(url) {
    const tree = this.router.parseUrl(url);
    const children = tree.root.children[PRIMARY_OUTLET];
    const segments = children.segments;

    return segments[1].path;
  }

  setUserContext() {
    const email = this.session.g.get('user').email;
    const id = this.session.g.get('user').id.toString();
    const username = `${this.session.g.get('user').firstname} ${
      this.session.g.get('user').lastname
    }`;

    ga('set', 'userId', email);

    Raven.setUserContext({ id, username, email });
  }

  redirectAndSaveGoTo(url): boolean {
    this.router.navigate(['/login'], {
      queryParams: {
        goTo: encodeURIComponent(url)
      },
      queryParamsHandling: 'merge'
    });

    return false;
  }

  canActivate(activatedRoute, state) {
    this.setZendesk(activatedRoute.data);

    const sessionKey = appStorage.get(appStorage.keys.SESSION);

    if (sessionKey) {
      if (!this.session.g.size) {
        return this.preLoadSchool(activatedRoute)
          .then((_) => this.preLoadUser())
          .then((_) => this.fetcthStores())
          .then((stores) => this.setDefaultHost(stores))
          .then((_) => true)
          .catch((_) => false);
      }

      return true;
    }

    return this.redirectAndSaveGoTo(state.url);
  }
}

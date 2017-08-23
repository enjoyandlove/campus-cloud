import { base64 } from './../../shared/utils/base64';
/**
 * Guard to check if user is authenticated
 */
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
import { CP_PRIVILEGES_MAP } from './../../shared/utils/privileges';
import { AdminService, SchoolService } from '../../shared/services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private session: CPSession,
    private adminService: AdminService,
    private schoolService: SchoolService
  ) { }

  preLoadUser(activatedRoute) {
    const school$ = this.schoolService.getSchools();

    return school$
      .switchMap(schools => {
        let schoolIdInUrl;
        let schoolObjFromUrl;
        const search = new URLSearchParams();
        const storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));

        try {
          schoolIdInUrl = base64.decode(activatedRoute.queryParams.school);
        } catch (error) {
          schoolIdInUrl = null;
        }

        if (schoolIdInUrl) {
          Object
            .keys(schools)
            .map((key: any) => {
              if (schools[key].id ===  +schoolIdInUrl) {
                schoolObjFromUrl = schools[key];
              }
            });
        }

        this.session.schools = schools;

        this.session.school = storedSchool || schoolObjFromUrl || schools[0];

        search.append('school_id', this.session.school.id.toString());

        return this.adminService.getAdmins(1, 1, search);
      })
      .toPromise()
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    const PROTECTED_ROUTES =
    [
      'events',
      'feeds',
      'clubs',
      'services',
      'lists',
      'links',
      'announcements',
      'templates'
    ];

    const ROUTES_MAP = {
      'events': {
        privilege: CP_PRIVILEGES_MAP.events
      },
      'feeds': {
        privilege: CP_PRIVILEGES_MAP.moderation
      },
      'clubs': {
        privilege: CP_PRIVILEGES_MAP.clubs
      },
      'services': {
        privilege: CP_PRIVILEGES_MAP.services
      },
      'lists': {
        privilege: CP_PRIVILEGES_MAP.campus_announcements
      },
      'links': {
        privilege: CP_PRIVILEGES_MAP.links
      },
      'announcements': {
        privilege: CP_PRIVILEGES_MAP.campus_announcements
      },
      'templates': {
        privilege: CP_PRIVILEGES_MAP.campus_announcements
      },
    }

    if (childRoute.url.length) {
      const path = childRoute.url[0].path;

      if (PROTECTED_ROUTES.includes(path)) {
        let canAccess;

        const schoolLevel = this.session.canSchoolReadResource(ROUTES_MAP[path].privilege);
        const accountLevel = this.session.canAccountLevelReadResource(ROUTES_MAP[path].privilege);

        canAccess = schoolLevel || accountLevel

        if (!canAccess) {
          this.router.navigate(['/welcome']);
        }
        return canAccess;
      }
    }
    return true;
  }

  canActivate(activatedRoute, state) {
    // are we logged in?
    if (appStorage.get(appStorage.keys.SESSION)) {

      // did we create the session object?
      if (!this.session.school || !this.session.user) {
        return this.preLoadUser(activatedRoute)

          .then(user => {
            this.session.user = user[0];
            return true;
          })
          .catch(_ => false);
      }

      return true
    }

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          goTo: encodeURIComponent(state.url)
        },
        queryParamsHandling: 'merge'
      }
    );

    return false;
  }
}



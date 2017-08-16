/**
 * Guard to check if user is authenticated
 */
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
// import { CP_PRIVILEGES } from './../../shared/utils/privileges';
import { AdminService, SchoolService } from '../../shared/services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private session: CPSession,
    private adminService: AdminService,
    private schoolService: SchoolService
  ) { }

  preLoadUser() {
    const school$ = this.schoolService.getSchools();

    return school$
      .switchMap(schools => {
        let search = new URLSearchParams();
        let storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));

        this.session.schools = schools;

        this.session.school = storedSchool || schools[0];

        search.append('school_id', this.session.school.id.toString());

        return this.adminService.getAdmins(1, 1, search);
      })
      .toPromise()
  }

  checkGoToRedirectPrivileges(_) {
    // const privilege = CP_PRIVILEGES[state.url.split('/')[state.url.split('/').length -1]];
    return new Promise((resolve, reject) => {
      if (this.session.privileges['readService']) {
        resolve(true);
        return;
      }

      this.router.navigate(['welcome']);
      reject(false);
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    const MANAGE_ROUTES = ['events', 'feeds', 'clubs', 'services', 'lists', 'links'];

    if (childRoute.url.length) {
      const routeName = childRoute.url[0].path;

      // if (MANAGE_ROUTES.includes(routeName)) {

      // }
      return true;
    }
    return true;
  }

  canActivate(__, state) {
    // are we logged in?
    if (appStorage.get(appStorage.keys.SESSION)) {

      // did we create the session object?
      if (!this.session.school || !this.session.user) {

        return this.preLoadUser()

          .then(user => {
            this.session.user = user[0];
            return this.session.updateSessionPrivileges();
          })

          .then(_ => this.checkGoToRedirectPrivileges(state))

          .then(_ => true)

          .catch(_ => false);
      }

      return true
    }

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          goTo: encodeURIComponent(state.url),
        }
      }
    );

    return false;
  }
}



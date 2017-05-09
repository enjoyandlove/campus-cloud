/**
 * Guard to check if user is authenticated
 */
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CanActivate } from '@angular/router';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
import { AdminService, SchoolService } from '../../shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private session: CPSession,
    private adminService: AdminService,
    private schoolService: SchoolService
  ) { }

  canActivate() {
    if (appStorage.get(appStorage.keys.SESSION)) {
      const admins$ = this.adminService.getAdmins(1, 1);
      const school$ = this.schoolService.getSchools();
      const stream$ = Observable.combineLatest(admins$, school$);

      if (!this.session.school || !this.session.user) {
        return stream$
          .toPromise()
          .then(res => {
            let storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));
            // global user
            this.session.user = res[0][0];

            // global users array
            this.session.schools = res[1];

            // global default school
            this.session.school =  storedSchool || res[1][0];
            return true;
          })
          .catch(_ => false);
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

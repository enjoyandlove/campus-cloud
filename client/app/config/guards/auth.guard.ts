/**
 * Guard to check if user is authenticated
 */
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { URLSearchParams } from '@angular/http';

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
      const school$ = this.schoolService.getSchools();

      if (!this.session.school || !this.session.user) {
        return school$
          .switchMap(schools => {
            let search = new URLSearchParams();
            let storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));

            this.session.schools = schools;

            // global default school
            this.session.school = storedSchool || schools[0];

            search.append('school_id', this.session.school.id.toString());

            return this.adminService.getAdmins(1, 1, search);
          })
          .toPromise()
          .then(user => {
            this.session.user = user[0];
            return this.session.updateSessionPrivileges();
          })
          .then(_ => true)
          .catch(_ => false);
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

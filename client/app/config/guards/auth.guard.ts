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
      const school$ = this.schoolService.getShool();
      const stream$ = Observable.combineLatest(admins$, school$);

      if (!this.session.school || !this.session.user) {
        console.log('no school or user data');
        return stream$
          .toPromise()
          .then(res => {
            this.session.user = res[0][0];
            this.session.school = res[1][1];
            return true;
          })
          .catch(_ => false);
      }
      console.log('school or user data exists');
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

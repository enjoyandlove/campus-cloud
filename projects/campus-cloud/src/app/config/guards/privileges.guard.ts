import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { AdminService, SchoolService, StoreService } from '@campus-cloud/shared/services';

import {
  canClientReadResource,
  canSchoolReadResource,
  canAccountLevelReadResource
} from '@campus-cloud/shared/utils';

@Injectable()
export class PrivilegesGuard implements CanActivate, CanActivateChild {
  constructor(
    public router: Router,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService
  ) {}

  canActivateChild(activatedRoute: ActivatedRouteSnapshot) {
    const privilege = this.getPrivilegeFromRouteData(activatedRoute.data);
    if (privilege) {
      return this.checkPrivilege(privilege);
    }

    const privileges = this.getPrivilegesFromRouteData(activatedRoute.data);
    if (privileges) {
      return this.checkPrivileges(privileges);
    }

    return true;
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    const privilege = this.getPrivilegeFromRouteData(activatedRoute.data);
    if (privilege) {
      return this.checkPrivilege(privilege);
    }

    const privileges = this.getPrivilegesFromRouteData(activatedRoute.data);
    if (privileges) {
      return this.checkPrivileges(privileges);
    }

    return true;
  }

  private getPrivilegeFromRouteData(data: any) {
    return _get(data, ['privilege'], null);
  }

  private getPrivilegesFromRouteData(data: any) {
    return _get(data, ['privileges'], null);
  }

  private checkPrivilege(privilege: number) {
    const hasPrivileges = this.hasPrivileges(privilege);

    if (!hasPrivileges) {
      this.router.navigate(['/dashboard']);
      return;
    }

    return true;
  }

  private checkPrivileges(privileges: Array<number>) {
    let hasPrivilege = false;
    for (let i = 0; i < privileges.length; i++) {
      hasPrivilege = this.hasPrivileges(privileges[i]);
      if (hasPrivilege) {
        break;
      }
    }

    if (!hasPrivilege) {
      this.router.navigate(['/dashboard']);
      return;
    }

    return true;
  }

  private hasPrivileges(privilege: number) {
    return (
      canClientReadResource(this.session.g, privilege) ||
      canSchoolReadResource(this.session.g, privilege) ||
      canAccountLevelReadResource(this.session.g, privilege)
    );
  }
}

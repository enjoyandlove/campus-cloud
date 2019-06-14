import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import {
  AdminService,
  SchoolService,
  StoreService,
  ZendeskService
} from '@campus-cloud/shared/services';

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
    public schoolService: SchoolService,
    public zendeskService: ZendeskService
  ) {}

  canActivateChild(activatedRoute: ActivatedRouteSnapshot) {
    const privilege = this.getPrivilegeFromRouteData(activatedRoute.data);
    if (!privilege) {
      return true;
    }

    this.setZendesk(activatedRoute.data);
    return this.checkPrivilege(privilege);
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    const privilege = this.getPrivilegeFromRouteData(activatedRoute.data);
    if (!privilege) {
      return true;
    }

    return this.checkPrivilege(privilege);
  }

  private getPrivilegeFromRouteData(data: any) {
    return _get(data, ['privilege'], null);
  }

  private checkPrivilege(privilege: number) {
    const hasPrivileges = this.hasPrivileges(privilege);

    if (!hasPrivileges) {
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

  private setZendesk(routeObj) {
    if ('zendesk' in routeObj) {
      this.zendeskService.setHelpCenterSuggestions({
        labels: [routeObj['zendesk']]
      });
    }
  }
}

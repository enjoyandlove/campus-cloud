import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';
import {
  Router,
  CanLoad,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  Route
} from '@angular/router';

import { CPSession } from '@app/session';
import { CP_PRIVILEGES } from '@shared/constants/privileges';
import { AdminService, SchoolService, StoreService, ZendeskService } from '@shared/services';
import { canSchoolReadResource, canAccountLevelReadResource } from '@client/app/shared/utils';

@Injectable()
export class PrivilegesGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    public router: Router,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService,
    public zendeskService: ZendeskService
  ) {}

  canLoad(route: Route) {
    const privilege = this.getPrivilegeFromRouteData(route.data);
    if (!privilege) {
      return true;
    }

    return this.hasPrivileges(privilege);
  }

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

    console.log(`User has access to ${CP_PRIVILEGES[privilege]}`);
    return true;
  }

  private hasPrivileges(privilege: number) {
    return (
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

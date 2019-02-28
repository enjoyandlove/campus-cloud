import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';
import {
  Router,
  CanLoad,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot
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

  canLoad() {
    return true;
  }

  canActivateChild(activatedRoute: ActivatedRouteSnapshot) {
    console.log('canActivateChild');
    this.setZendesk(activatedRoute.data);
    return this.checkPrivileges(activatedRoute);
  }

  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    return this.checkPrivileges(activatedRoute);
  }

  private checkPrivileges(route: ActivatedRouteSnapshot) {
    const privilege = _get(route, ['data', 'privilege'], null);

    if (!privilege) {
      console.log('NO PRIVILEGE INFO FOR ', route.url);
      return true;
    }

    const hasPrivileges = this.hasPrivileges(privilege);

    if (!hasPrivileges) {
      this.router.navigate(['/dashboard']);
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

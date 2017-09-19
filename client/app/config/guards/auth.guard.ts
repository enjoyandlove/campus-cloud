/**
 * Guard to check if user is authenticated
 */
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Raven from 'raven-js';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
import { CP_PRIVILEGES_MAP } from './../../shared/constants';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private session: CPSession
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    const PROTECTED_ROUTES = [ 'events', 'feeds', 'clubs', 'services', 'lists', 'links',
                               'announcements', 'templates' ];

    const ROUTES_MAP = {
      'events': CP_PRIVILEGES_MAP.events,

      'feeds': CP_PRIVILEGES_MAP.moderation,

      'clubs': CP_PRIVILEGES_MAP.clubs,

      'services': CP_PRIVILEGES_MAP.services,

      'lists': CP_PRIVILEGES_MAP.campus_announcements,

      'links': CP_PRIVILEGES_MAP.links,

      'announcements': CP_PRIVILEGES_MAP.campus_announcements,

      'templates': CP_PRIVILEGES_MAP.campus_announcements,
    }

    if (childRoute.url.length) {
      const path = childRoute.url[0].path;

      if (PROTECTED_ROUTES.includes(path)) {
        let canAccess;

        const schoolLevel = this.session.canSchoolReadResource(ROUTES_MAP[path]);
        const accountLevel = this.session.canAccountLevelReadResource(ROUTES_MAP[path]);

        canAccess = schoolLevel || accountLevel

        if (!canAccess) {
          this.router.navigate(['/welcome']);
        }
        return canAccess;
      }
    }
    return true;
  }

  setUserContext() {
    Raven.setUserContext({
      id: this.session.g.get('user').id.toString(),
      username: `${this.session.g.get('user').firstname} ${this.session.g.get('user').lastname}`,
      email: this.session.g.get('user').email
    });
  }

  redirectAndSaveGoTo(url): boolean {
    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          goTo: encodeURIComponent(url)
        },
        queryParamsHandling: 'merge'
      }
    );

    return false;
  }

  canActivate(activatedRoute, state) {
    const sessionKey = appStorage.get(appStorage.keys.SESSION);
    // are we logged in?
    if (sessionKey) {
      // did we create the session object?
      if (!this.session.g.size) {
        return this.session.preLoadUser(activatedRoute)
          .then(user => {
            this.session.g.set('user', user[0]);

            this.setUserContext();

            return true;
          })
          .catch(_ => false);
      }
      return true
    }

    return this.redirectAndSaveGoTo(state.url);
  }
}



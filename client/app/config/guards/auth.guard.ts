import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { CPSession } from '../../session';
import { appStorage } from '../../shared/utils';
import { CPLogger } from '@shared/services/logger';
import { base64 } from './../../shared/utils/encrypt/encrypt';
import { environment } from './../../../environments/environment';
import { AdminService, SchoolService, StoreService, ZendeskService } from '../../shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public router: Router,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService,
    public zendeskService: ZendeskService
  ) {}

  preLoadUser(): Promise<any> {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id.toString());

    return this.adminService
      .getAdmins(1, 1, search)
      .pipe(
        map((users) => {
          this.session.g.set('user', users[0]);

          if (environment.production) {
            this.setUserContext();
          }

          return users;
        })
      )
      .toPromise();
  }

  preLoadSchool(route: ActivatedRouteSnapshot): Promise<any> {
    return this.schoolService
      .getSchools()
      .pipe(
        map((schools) => {
          let schoolIdInUrl;
          let schoolObjFromUrl;
          const storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));

          try {
            schoolIdInUrl = base64.decode(route.queryParams.school);
          } catch (error) {
            schoolIdInUrl = null;
          }

          if (schoolIdInUrl) {
            Object.keys(schools).map((key: any) => {
              if (schools[key].id === +schoolIdInUrl) {
                schoolObjFromUrl = schools[key];
              }
            });
          }

          this.session.g.set('schools', schools);

          this.session.g.set('school', storedSchool || schoolObjFromUrl || schools[0]);
        })
      )
      .toPromise();
  }

  fetchStores(): Promise<any> {
    const search = new HttpParams().set('school_id', this.session.g.get('school').id.toString());

    return this.storeService.getStores(search).toPromise();
  }

  setDefaultHost(stores): Promise<null> {
    let defaultHost = null;

    return new Promise((resolve) => {
      const schoolDefaultHost = this.session.g.get('school').main_union_store_id;

      stores.map((store) => {
        if (store.value === schoolDefaultHost) {
          defaultHost = store;
        }
      });

      this.session.defaultHost = defaultHost;
      resolve();
    });
  }

  private setZendesk(routeObj) {
    if ('zendesk' in routeObj) {
      this.zendeskService.setHelpCenterSuggestions({
        labels: [routeObj['zendesk']]
      });
    }
  }

  setUserContext() {
    const email = this.session.g.get('user').email;
    const id = this.session.g.get('user').id.toString();
    const username = `${this.session.g.get('user').firstname} ${
      this.session.g.get('user').lastname
    }`;

    ga('set', 'userId', email);

    CPLogger.setUser({ id, username, email });
  }

  redirectAndSaveGoTo(url): boolean {
    this.router.navigate(['/login'], {
      queryParams: {
        goTo: encodeURIComponent(url)
      },
      queryParamsHandling: 'merge'
    });

    return false;
  }

  async canActivate(activatedRoute, state) {
    this.setZendesk(activatedRoute.data);

    const sessionKey = appStorage.storageAvailable()
      ? appStorage.get(appStorage.keys.SESSION)
      : null;

    if (sessionKey) {
      if (!this.session.g.size) {
        try {
          await this.preLoadSchool(activatedRoute);
          await this.preLoadUser();
          const stores = await this.fetchStores();
          await this.setDefaultHost(stores);
        } catch {
          return false;
        }

        return true;
      }

      return true;
    }

    return this.redirectAndSaveGoTo(state.url);
  }
}

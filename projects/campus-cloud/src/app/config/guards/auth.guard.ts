import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { EnvService } from '../env';
import { appStorage } from '@campus-cloud/shared/utils';
import { CPSession, ISchool } from '@campus-cloud/session';
import { CPLogger } from '@campus-cloud/shared/services/logger';
import { base64 } from '@campus-cloud/shared/utils/encrypt/encrypt';
import { ICampusStore, StoreCategoryType } from '@campus-cloud/shared/models';
import {
  AdminService,
  StoreService,
  SchoolService,
  FullStoryService,
  CPAmplitudeService
} from '@campus-cloud/shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public router: Router,
    private env: EnvService,
    public session: CPSession,
    public storeService: StoreService,
    public adminService: AdminService,
    public schoolService: SchoolService
  ) {}

  preLoadUser(): Promise<any> {
    const search = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.adminService
      .getAdmins(1, 1, search)
      .pipe(
        map((users) => {
          this.session.g.set('user', users[0]);

          if (this.env.name !== 'development') {
            this.setUserContext();
          }

          const user = this.session.g.get('user');
          const school = this.session.g.get('school');

          FullStoryService.indentify(user, school);

          return users;
        })
      )
      .toPromise();
  }

  preLoadSchool(route: ActivatedRouteSnapshot): Promise<any> {
    return this.schoolService
      .getSchools()
      .pipe(
        map((schools: ISchool[]) => {
          let schoolIdInUrl;
          let schoolObjFromUrl;
          const storedSchoolId: number = parseInt(
            appStorage.get(appStorage.keys.DEFAULT_SCHOOL_ID),
            10
          );
          let storedSchool;

          if (storedSchoolId) {
            storedSchool = schools.find((school) => school.id === storedSchoolId);
            if (!storedSchool) {
              appStorage.remove(appStorage.keys.DEFAULT_SCHOOL_ID);
            }
          }

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

  getSchoolConfig(): Promise<any> {
    const search = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.schoolService
      .getSchoolConfig(search)
      .toPromise()
      .then((config) => this.session.g.set('schoolConfig', config))
      .catch();
  }

  setDefaultHost(): Promise<any> {
    /**
     * try calling `store` using the schools' main_union_store_id
     * if it fails it means the user does not have access to it and
     * we should not populate the defaultHost in CPSession
     */
    const storeId = this.session.school.main_union_store_id;
    const search = new HttpParams()
      .set('school_id', this.session.school.id.toString())
      .set(
        'category_ids',
        `${StoreCategoryType.athletics}, ${StoreCategoryType.club}, ${StoreCategoryType.services}`
      );

    return new Promise((resolve) =>
      this.storeService
        .getStoreById(storeId, search)
        .toPromise()
        .then(({ name, id, category_id }: ICampusStore) => {
          this.session.defaultHost = {
            label: name,
            value: id,
            heading: false,
            hostType: CPAmplitudeService.storeCategoryIdToAmplitudeName(category_id)
          };
          resolve();
        })
        .catch(() => resolve())
    );
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
    const sessionKey = appStorage.storageAvailable()
      ? appStorage.get(appStorage.keys.SESSION)
      : null;

    if (sessionKey) {
      if (!this.session.g.size) {
        try {
          await this.preLoadSchool(activatedRoute);
          await this.getSchoolConfig();
          await this.preLoadUser();
          await this.setDefaultHost();
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

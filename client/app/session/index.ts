/**
 * USER => Currently logged in User
 * SCHOOLS => Array of schools that the logged in user has access to, this is often 1
 * SCHOOL => Currently selected school, this is the active school in the school switcher component
 */
import { ActivatedRouteSnapshot } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

// import { IUser } from './user.interface';
// import { ISchool } from './school.interface';

export * from './user.interface';
export * from './school.interface';

import { base64 } from './../shared/utils/encrypt/encrypt';
import { appStorage } from './../shared/utils/storage/storage';
import { AdminService } from './../shared/services/admin.service';
import { SchoolService } from './../shared/services/school.service';

export const accountsToStoreMap = (accountsMap: Array<number>, accountPrivileges) => {
  /**
   * @return obj similar to account_privielges but with
   * only the storeId that the user has access to
   */
  let accounts = {};

  accountsMap.map(storeId => {
    if (storeId in accountPrivileges) {
      accounts[storeId] = accountPrivileges[storeId];
    }
  });
  return accounts;
}

@Injectable()
export class CPSession {
  public g = new Map();

  constructor(
    private adminService: AdminService,
    private schoolService: SchoolService
  ) { }

  preLoadUser(activatedRoute: ActivatedRouteSnapshot): Promise<any> {
    const school$ = this.schoolService.getSchools();

    return school$
    .switchMap(schools => {
      let schoolIdInUrl;
      let schoolObjFromUrl;
      const search = new URLSearchParams();
      const storedSchool = JSON.parse(appStorage.get(appStorage.keys.DEFAULT_SCHOOL));

      try {
        schoolIdInUrl = base64.decode(activatedRoute.queryParams.school);
      } catch (error) {
        schoolIdInUrl = null;
      }

      if (schoolIdInUrl) {
        Object
          .keys(schools)
          .map((key: any) => {
            if (schools[key].id ===  +schoolIdInUrl) {
              schoolObjFromUrl = schools[key];
            }
          });
      }

      this.g.set('schools', schools);
      this.g.set('school', schools[0]);

      this.g.set('school', storedSchool || schoolObjFromUrl || schools[0]);

      search.append('school_id', this.g.get('school').id.toString());

      return this.adminService.getAdmins(1, 1, search);
    })
    .toPromise()
  }

  canStoreReadAndWriteResource(storeId: number, privilegeType: number) {
    if (storeId in this.g.get('user').account_level_privileges) {
      return privilegeType in this.g.get('user').account_level_privileges[storeId]
    }
    return false;
  }

  canAccountLevelReadResource(privilegeType: number) {
    let hasAccountAccess = false;

    this.g.get('user').account_mapping[this.g.get('school').id].forEach(store => {
      Object.keys(this.g.get('user').account_level_privileges[store]).forEach(privilege => {

        if (privilegeType === +privilege) {
          hasAccountAccess = true;
        }
      });
    });

    return hasAccountAccess;
  }

  canSchoolReadResource(privilegeType: number) {
    if (!(Object.keys(this.g.get('user').school_level_privileges).length)) {
      return false;
    }

    if (!(this.g.get('school').id in this.g.get('user').school_level_privileges)) {
      return false;
    }

    const schoolPrivileges = this.g.get('user').school_level_privileges[this.g.get('school').id];

    if (privilegeType in schoolPrivileges) {
      return schoolPrivileges[privilegeType].r
    }
    return false;
  }

  canSchoolWriteResource(privilegeType: number) {
    if (!(Object.keys(this.g.get('user').school_level_privileges).length)) {
      return false;
    }

    if (!(this.g.get('school').id in this.g.get('user').school_level_privileges)) {
      return false;
    }

    const schoolPrivileges = this.g.get('user').school_level_privileges[this.g.get('school').id];

    if (privilegeType in schoolPrivileges) {
      return schoolPrivileges[privilegeType].w
    }
    return false;
  }
};

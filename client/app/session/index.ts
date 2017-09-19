/**
 * USER => Currently logged in User
 * SCHOOLS => Array of schools that the logged in user has access to, this is often 1
 * SCHOOL => Currently selected school, this is the active school in the school switcher component
 */
import { Injectable } from '@angular/core';

// import { IUser } from './user.interface';
// import { ISchool } from './school.interface';

export * from './user.interface';
export * from './school.interface';

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
  // private _user: IUser;
  // private _school: ISchool;
  // private _schools: Array<ISchool>;

  // set(key: string, value: any): void {
  //   this._g[key] = value
  // }

  // get(key = null) {
  //   return key ? this._g[key] : this._g;
  // }

  // keys() {
  //   return Object.keys(this._g);
  // }

  // get user(): IUser {
  //   return this._user;
  // }

  // set user(user: IUser) {
  //   this._user = user;
  // }

  // get schools(): Array<ISchool> {
  //   return this._schools;
  // }

  // set schools(school: Array<ISchool>) {
  //   this._schools = school;
  // }

  // get school(): ISchool {
  //   return this._school;
  // }

  // set school(school: ISchool) {
  //   this._school = school;
  // }

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

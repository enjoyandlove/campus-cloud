/**
 * USER => Currently logged in User
 * SCHOOLS => Array of schools that the logged in user has access to, this is often 1
 * SCHOOL => Currently selected school, this is the active school in the school switcher component
 */
import { Injectable } from '@angular/core';

import { IUser } from './user.interface';
import { ISchool } from './school.interface';

export * from './user.interface';
export * from './school.interface';

@Injectable()
export class CPSession {
  private _user: IUser;
  private _school: ISchool;
  private _schools: Array<ISchool>;

  get user(): IUser {
    return this._user;
  }

  set user(user: IUser) {
    this._user = user;
  }

  get schools(): Array<ISchool> {
    return this._schools;
  }

  set schools(school: Array<ISchool>) {
    this._schools = school;
  }

  get school(): ISchool {
    return this._school;
  }

  set school(school: ISchool) {
    this._school = school;
  }

  canStoreReadAndWriteResource(storeId: number, privilegeType: number) {
    if (storeId in this.user.account_level_privileges) {
      return privilegeType in this.user.account_level_privileges[storeId]
    }
    return false;
  }

  canAccountLevelReadResource(privilegeType: number) {
    let hasAccountAccess = false;

    this.user.account_mapping[this.school.id].forEach(store => {
      Object.keys(this.user.account_level_privileges[store]).forEach(privilege => {

        if (privilegeType === +privilege) {
          hasAccountAccess = true;
        }
      });
    });

    return hasAccountAccess;
  }

  canSchoolReadResource(privilegeType: number) {
    const schoolPrivileges = this.user.school_level_privileges[this.school.id];

    if (privilegeType in schoolPrivileges) {
      return schoolPrivileges[privilegeType].r
    }
    return false;
  }

  canSchoolWriteResource(privilegeType: number) {
    const schoolPrivileges = this.user.school_level_privileges[this.school.id];

    if (privilegeType in schoolPrivileges) {
      return schoolPrivileges[privilegeType].w
    }
    return false;
  }
};

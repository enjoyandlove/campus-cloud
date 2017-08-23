/**
 * USER => Currently logged in User
 * SCHOOLS => Array of schools that the logged in user has access to, this is often 1
 * SCHOOL => Currently selected school, this is the active school in the school switcher component
 */
import { Injectable } from '@angular/core';

import { IUser } from './user.interface';
import { ISchool } from './school.interface';
import { IPrivileges } from './privileges.interface';
import { CP_PRIVILEGES_MAP } from './../shared/utils/privileges';

export * from './user.interface';
export * from './school.interface';
export * from './privileges.interface';

/**
 * Need to filter account_level_privileges for those
 * stores that the user has access to for this particular school
 */
const storesInSchool = (privileges, stores: Array<number>) => {
  return stores.map(store => privileges[store]);
};

@Injectable()
export class CPSession {
  private _user: IUser;
  private _school: ISchool;
  private _schools: Array<ISchool>;

  private _privileges: IPrivileges = {
    readEvent: false,
    readFeed: false,
    readClub: false,
    readService: false,
    readList: false,
    readLink: false,
    readNotify: false,
    readAssess: false,
    readAdmin: false
  };

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

  get privileges() {
    return this._privileges;
  }

  canAccountManageResource(storeId: number, privilegeType: number) {
    return privilegeType in this.user.account_level_privileges[storeId];
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

  updateSessionPrivileges(): Promise<null> {
    console.log(this.user);
    return new Promise(resolve => {
      this._privileges['readEvent'] = this.canViewEvents(this._school.id);
      this._privileges['readFeed'] = this.canViewFeeds(this._school.id);
      this._privileges['readClub'] = this.canViewClubs(this._school.id);
      this._privileges['readService'] = this.canViewServices(this._school.id);
      this._privileges['readList'] = this.canViewLists(this._school.id);
      this._privileges['readLink'] = this.canViewLinks(this._school.id);
      this._privileges['readNotify'] = this.canViewNotify(this._school.id);
      this._privileges['readAssess'] = this.canViewAssess(this._school.id);
      this._privileges['readAdmin'] = this.canViewTeamSettings(this._school.id);

      return resolve();
    });
  }

  // canSchoolEvents() {

  // }

  private canViewNotify(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.campus_announcements in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.campus_announcements].r;
    }
    return false;
  }

  private canViewAssess(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.assessment in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.assessment].r;
    }
    return false;
  }

  private canViewEvents(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.events in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.events].r;
    }
    return false;
  }

  private canViewFeeds(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.moderation in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.moderation].r;
    }
    return false;
  }

  private canViewClubs(schoolId: number): boolean {
    let school = false;
    let { account_level_privileges, account_mapping } = this.user;

    if (CP_PRIVILEGES_MAP.clubs in this.user.school_level_privileges[schoolId]) {
      school = this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.clubs].r;
    }

    const accounts = storesInSchool(account_level_privileges, account_mapping[this.school.id]);
    const account = accountLevelPrivilege(accounts, CP_PRIVILEGES_MAP.clubs);

    return school || account;
  }

  private canViewServices(schoolId: number): boolean {
    let school = false;
    let { account_level_privileges, account_mapping } = this.user;

    if (CP_PRIVILEGES_MAP.services in this.user.school_level_privileges[schoolId]) {
      school = this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.services].r;
    }

    const accounts = storesInSchool(account_level_privileges, account_mapping[this.school.id]);
    const account = accountLevelPrivilege(accounts, CP_PRIVILEGES_MAP.services);

    return school || account;
  }

  private canViewLists(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.campus_announcements in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.campus_announcements].r;
    }
    return false;
  }

  private canViewLinks(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.links in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.links].r;
    }
    return false;
  }

  private canViewTeamSettings(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.manage_admin in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.manage_admin].r;
    }
    return false;
  }
};

function accountLevelPrivilege(stores, privilege) {
  let hasAccountAccess = false;

  Object.keys(stores).forEach(store => {
    Object.keys(stores[store]).forEach(p => {
      if (privilege === +p) {
        hasAccountAccess = true;
      }
    });
  });

  return hasAccountAccess;
}

/**
 * USER => Currently logged in User
 * SCHOOLS => Array of schools that the logged in user has access to, this is often 1
 * SCHOOL => Currently selected school, this is the active school in the school switcher component
 */
import { Injectable } from '@angular/core';

import { IUser } from './user.interface';
import { ISchool } from './school.interface';
import { CP_PRIVILEGES_MAP } from './../shared/utils/privileges';

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

  canViewNotify(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.campus_announcements in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.campus_announcements].r;
    }
    return false;
  }

  canViewAssess(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.assessment in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.assessment].r;
    }
    return false;
  }

  canViewEvents(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.events in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.events].r;
    }
    return false;
  }

  canViewFeeds(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.moderation in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.moderation].r;
    }
    return false;
  }

  canViewClubs(schoolId: number): boolean {
    let school = false;

    if (CP_PRIVILEGES_MAP.clubs in this.user.school_level_privileges[schoolId]) {
      school = this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.clubs].r;
    }

    const account = accountLevelPrivilege(this.user.account_level_privileges,
      CP_PRIVILEGES_MAP.clubs);

    return school || account;
  }

  canViewServices(schoolId: number): boolean {
    let school = false;

    if (CP_PRIVILEGES_MAP.services in this.user.school_level_privileges[schoolId]) {
      school = this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.services].r;
    }

    const account = accountLevelPrivilege(this.user.account_level_privileges,
      CP_PRIVILEGES_MAP.services);

    return school || account;
  }

  canViewLists(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.campus_announcements in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.campus_announcements].r;
    }
    return false;
  }

  canViewLinks(schoolId: number): boolean {
    if (CP_PRIVILEGES_MAP.links in this.user.school_level_privileges[schoolId]) {
      return this.user.school_level_privileges[schoolId][CP_PRIVILEGES_MAP.links].r;
    }
    return false;
  }

  canViewTeamSettings(schoolId: number): boolean {
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

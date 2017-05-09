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
};

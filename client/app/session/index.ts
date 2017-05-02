import { Injectable } from '@angular/core';

import { IUser } from './user.interface';
import { ISchool } from './school.interface';

@Injectable()
export class CPSession {
  private _user: IUser;
  private _school: ISchool;

  get user(): IUser {
    return this._user;
  }

  set user(user: IUser) {
    this._user = user;
  }

  get school(): ISchool {
    return this._school;
  }

  set school(school: ISchool) {
    this._school = school;
  }
};

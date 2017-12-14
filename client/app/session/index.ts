/**
 * All session data should be set
 * as part of the g (global) Map
 */
import { Injectable } from '@angular/core';

export * from './user.interface';
export * from './school.interface';

import { CP_PRIVILEGES_MAP } from '../shared/constants';
import { canSchoolWriteResource } from './../shared/utils/privileges/privileges';

@Injectable()
export class CPSession {
  public g = new Map();

  public isSuperAdmin() {
    const clubsSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.clubs);
    const assessSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.assessment);
    const serviceSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.services);

    return clubsSchoolWide && assessSchoolWide && serviceSchoolWide;
  }

  constructor() { }
};

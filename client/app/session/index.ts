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
    const clubsWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.clubs);
    const assessWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.assessment);
    const serviceSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.services);

    return clubsWide && assessWide && serviceSchoolWide;
  }

  constructor() { }
};

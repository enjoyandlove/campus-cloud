/**
 * All session data should be set
 * as part of the g (global) Map
 */
import { Injectable } from '@angular/core';

// import { IUser } from './user.interface';
// import { ISchool } from './school.interface';

export * from './user.interface';
export * from './school.interface';

import {
  canSchoolReadResource,
  canSchoolWriteResource,
  canAccountLevelReadResource,
  canStoreReadAndWriteResource,
} from './../shared/utils/privileges/privileges';

export * from './../shared/utils/privileges/privileges';

@Injectable()
export class CPSession {
  public g = new Map();

  constructor() { }

  canStoreReadAndWriteResource(storeId: number, privilegeType: number) {
    return canStoreReadAndWriteResource(this.g, storeId, privilegeType);
  }

  canAccountLevelReadResource(privilegeType: number) {
    return canAccountLevelReadResource(this.g, privilegeType);
  }

  canSchoolReadResource(privilegeType: number) {
    return canSchoolReadResource(this.g, privilegeType);
  }

  canSchoolWriteResource(privilegeType: number) {
    return canSchoolWriteResource(this.g, privilegeType);
  }
};

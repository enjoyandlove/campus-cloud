import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { omit } from 'lodash';

import { AccessType, apiPrefix } from './model/api-management.interface';

@Injectable()
export class ApiManagementUtilsService {
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  static getAPIKeyPrefix(key: string) {
    const splitPrefix = key.split('_');
    const prefix = apiPrefix[splitPrefix[0]];

    return prefix ? `${prefix}_` : null;
  }

  static getPermissionData(object) {
    return Object.keys(object).length ? object : null;
  }

  static getTokenPermission(hasPermission, type, tokenPermissionData) {
    if (hasPermission) {
      return {
        ...tokenPermissionData,
        [type]: AccessType.write
      };
    }

    return omit(tokenPermissionData, [type]);
  }
}

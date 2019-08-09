import { Injectable } from '@angular/core';

import { AccessType } from './model/api-management.interface';

@Injectable()
export class ApiManagementUtilsService {
  static getAPIKeyPrefix(key: string) {
    const prefix = key.split('_');

    return `${prefix[0]}_`;
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

    delete tokenPermissionData[type];

    return tokenPermissionData;
  }
}

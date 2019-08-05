import { Injectable } from '@angular/core';

@Injectable()
export class ApiManagementUtilsService {
  static getAPIKeyPrefix(key: string) {
    const prefix = key.split('_');

    return `${prefix[0]}_`;
  }
}

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { AccessType, apiPrefix } from './model/api-management.interface';

@Injectable()
export class ApiManagementUtilsService {
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  static getAPIKeyPrefix(key: string) {
    const splitPrefix = key.split('_');
    const prefix = apiPrefix[splitPrefix[0]];

    return prefix ? `${prefix}_` : null;
  }

  static parseFormValue(form: FormGroup) {
    const { permission_data, ...token } = form.value;
    let res = {};

    Object.keys(permission_data)
      .filter((permission: string) => permission_data[permission])
      .forEach((permission: string) => {
        res[permission] = AccessType.write;
      });

    return {
      ...token,
      permission_data: { ...res }
    };
  }
}

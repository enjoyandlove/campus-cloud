import { Pipe, PipeTransform } from '@angular/core';

import {
  canSchoolWriteResource,
  canStoreReadAndWriteResource
} from '@campus-cloud/shared/utils/privileges';
import { CPSession } from '@campus-cloud/session';
import { IPermission, permissionType } from './../permissions';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

@Pipe({ name: 'cpFilterByStorePrivileges' })
export class TeamSelectModalPermissionPipe implements PipeTransform {
  constructor(public session: CPSession) {}

  transform(permissions: Array<IPermission>, privilegeType: number, storeId: number): any {
    if (privilegeType === CP_PRIVILEGES_MAP.clubs) {
      const schoolAccess = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

      const storeLevelAccess = canStoreReadAndWriteResource(
        this.session.g,
        storeId,
        CP_PRIVILEGES_MAP.clubs
      );

      return schoolAccess || storeLevelAccess
        ? permissions
        : permissions.filter((permission) => permission.type === permissionType.read);
    }

    return permissions;
  }
}

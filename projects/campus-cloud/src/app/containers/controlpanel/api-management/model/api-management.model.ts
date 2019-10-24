import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { get as _get } from 'lodash';

import { CustomValidators } from '@campus-cloud/shared/validators';
import { ApiType, IPublicApiAccessToken } from './api-management.interface';

export class PublicApiAccessTokenModel {
  static form(api?: IPublicApiAccessToken) {
    const fb = new FormBuilder();

    return fb.group(
      {
        client_id: [null, Validators.required],
        is_sandbox: [null, Validators.required],
        permission_data: fb.group({
          user: [_get(api, ['permission_data', ApiType.user], false)],
          campus: [_get(api, ['permission_data', ApiType.campus], false)],
          audience: [_get(api, ['permission_data', ApiType.audience], false)],
          experience: [_get(api, ['permission_data', ApiType.experience], false)],
          notification: [_get(api, ['permission_data', ApiType.notification], false)]
        }),
        name: [
          _get(api, 'name', null),
          Validators.compose([
            Validators.required,
            CustomValidators.requiredNonEmpty,
            Validators.maxLength(250)
          ])
        ]
      },
      {
        validators: this.customPermissionsValidator.bind(this)
      }
    );
  }

  static customPermissionsValidator(ctrl) {
    const permissionDataCtrl = ctrl.get('permission_data') as FormGroup;
    const permissionControls = Object.keys(permissionDataCtrl.controls);
    const uncheckedPermissions: string[] = permissionControls.filter(
      (c: any) => !ctrl.get('permission_data').get(c).value
    );

    return uncheckedPermissions.length === permissionControls.length ? { required: true } : null;
  }
}

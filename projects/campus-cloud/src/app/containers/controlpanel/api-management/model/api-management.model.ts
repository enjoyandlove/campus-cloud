import { FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from '@campus-cloud/shared/validators';
import { IPublicApiAccessToken } from './api-management.interface';
import { ApiManagementUtilsService } from '../api-management.utils.service';

export class PublicApiAccessTokenModel {
  static form(api?: IPublicApiAccessToken) {
    const fb = new FormBuilder();

    const _api = {
      name: api ? api.name : null,
      permission_data: api ? ApiManagementUtilsService.getPermissionData(api.permission_data) : null
    };

    return fb.group({
      user_info: [null],
      push_notification: [null],
      client_id: [null, Validators.required],
      is_sandbox: [null, Validators.required],
      permission_data: [_api.permission_data, Validators.required],
      name: [
        _api.name,
        Validators.compose([
          Validators.required,
          CustomValidators.requiredNonEmpty,
          Validators.maxLength(250)
        ])
      ]
    });
  }
}

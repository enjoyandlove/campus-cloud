import { FormBuilder, Validators } from '@angular/forms';
import { get as _get } from 'lodash';

import { CustomValidators } from '@campus-cloud/shared/validators';

export class ServicesModel {
  static form(service?) {
    const fb = new FormBuilder();

    return fb.group({
      city: [_get(service, 'city', null)],
      email: [_get(service, 'email', null)],
      latitude: [_get(service, 'latitude', 0)],
      country: [_get(service, 'country', null)],
      longitude: [_get(service, 'longitude', 0)],
      location: [_get(service, 'location', null)],
      province: [_get(service, 'province', null)],
      room_data: [_get(service, 'room_data', null)],
      description: [_get(service, 'description', null)],
      postal_code: [_get(service, 'postal_code', null)],
      contactphone: [_get(service, 'contactphone', null)],
      secondary_name: [_get(service, 'secondary_name', null)],
      has_membership: [_get(service, 'has_membership', null)],
      address: [_get(service, 'address', null), Validators.required],
      service_attendance: [_get(service, 'service_attendance', null)],
      logo_url: [_get(service, 'logo_url', null), Validators.required],
      category: [_get(service, 'category', null), Validators.required],
      rating_scale_maximum: [_get(service, 'rating_scale_maximum', null)],
      website: [_get(service, 'website', null), Validators.maxLength(1024)],
      default_basic_feedback_label: [_get(service, 'default_basic_feedback_label', null)],
      name: [
        _get(service, 'name', null),
        Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
      ]
    });
  }
}

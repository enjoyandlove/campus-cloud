import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { get as _get } from 'lodash';

import { CustomValidators } from '@campus-cloud/shared/validators';
import { ClubStatus } from '@controlpanel/manage/clubs/club.status';
import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';

export function advisorDataRequired(isSJSU): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isBlank = control.value === '' || control.value === null;

    const required = isSJSU ? isBlank : false;

    return required ? { required: true } : null;
  };
}

export class ClubsModel {
  static form(isAthletic, club?, limitedAdmin?) {
    const fb = new FormBuilder();

    return fb.group({
      city: [_get(club, 'city', null)],
      email: [_get(club, 'email', null)],
      phone: [_get(club, 'phone', null)],
      latitude: [_get(club, 'latitude', 0)],
      country: [_get(club, 'country', null)],
      website: [_get(club, 'website', null)],
      longitude: [_get(club, 'longitude', 0)],
      location: [_get(club, 'location', null)],
      province: [_get(club, 'province', null)],
      logo_url: [_get(club, 'logo_url', null)],
      room_info: [_get(club, 'room_info', null)],
      description: [_get(club, 'description', null)],
      postal_code: [_get(club, 'postal_code', null)],
      category_id: [_get(club, 'category_id', isAthletic)],
      address: [_get(club, 'address', null), Validators.required],
      status: [_get(club, 'status', ClubStatus.active), Validators.required],
      has_membership: [_get(club, 'has_membership', true), Validators.required],
      name: [
        { value: _get(club, 'name', null), disabled: limitedAdmin },
        Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
      ],
      advisor_firstname: [
        { value: _get(club, 'advisor_firstname', null), disabled: limitedAdmin },
        advisorDataRequired(ClubsUtilsService.isSJSU(club))
      ],
      advisor_lastname: [
        { value: _get(club, 'advisor_lastname', null), disabled: limitedAdmin },
        advisorDataRequired(ClubsUtilsService.isSJSU(club))
      ],
      advisor_email: [
        { value: _get(club, 'advisor_email', null), disabled: limitedAdmin },
        advisorDataRequired(ClubsUtilsService.isSJSU(club))
      ]
    });
  }
}

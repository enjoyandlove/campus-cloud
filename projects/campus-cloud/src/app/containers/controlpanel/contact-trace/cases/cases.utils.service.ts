import { Injectable } from '@angular/core';
import { ICase, ICaseStatus } from './cases.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { getItem } from '@campus-cloud/shared/components';

@Injectable()
export class CasesUtilsService {
  constructor(public fb: FormBuilder) {}

  getCaseForm(formData: ICase) {
    return this.fb.group({
      firstname: [formData ? formData.firstname : null, Validators.required],
      lastname: [formData ? formData.lastname : null, Validators.required],
      extern_user_id: [formData ? formData.extern_user_id : null, Validators.required],
      current_status_id: [
        formData && formData.current_status_id != 0 ? formData.current_status_id : 1
      ]
    });
  }

  parsedEventProperties(data) {
    const extern_user_id = data.extern_user_id ? amplitudeEvents.YES : amplitudeEvents.NO;
    const firstname = data.firstname ? amplitudeEvents.YES : amplitudeEvents.NO;
    const lastname = data.lastname ? amplitudeEvents.YES : amplitudeEvents.NO;
    const current_status_id = data.current_status_id ? amplitudeEvents.YES : amplitudeEvents.NO;

    return {
      extern_user_id,
      firstname,
      lastname,
      current_status_id
    };
  }

  public getCaseStatusOptions(status: ICaseStatus[], label?: string) {
    const heading = [
      {
        label,
        action: null
      }
    ];

    const _heading = label ? heading : [];

    const _statuses = status.map((item: ICaseStatus) => {
      return getItem(item, 'name', 'id');
    });

    return [..._heading, ..._statuses];
  }
}

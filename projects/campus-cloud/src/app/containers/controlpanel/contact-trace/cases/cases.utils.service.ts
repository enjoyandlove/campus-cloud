import { Injectable } from '@angular/core';
import { ICase, ICaseStatus } from './cases.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { getItem } from '@campus-cloud/shared/components';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { CPDate, Formats, createSpreadSheet } from '@campus-cloud/shared/utils';
import { CPSession } from '@projects/campus-cloud/src/app/session';

@Injectable()
export class CasesUtilsService {
  constructor(public fb: FormBuilder, public cpI18nPipe: CPI18nPipe, public session: CPSession) {}

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

  exportCases(cases) {
    let columns = [
      this.cpI18nPipe.transform('first_name'),
      this.cpI18nPipe.transform('last_name'),
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('student_id'),
      this.cpI18nPipe.transform('t_data_export_csv_walls_date_created'),
      this.cpI18nPipe.transform('t_case_status')
    ];

    cases = cases.map((item) => {
      return {
        [this.cpI18nPipe.transform('first_name')]: item.firstname,

        [this.cpI18nPipe.transform('last_name')]: item.lastname,

        [this.cpI18nPipe.transform('email')]: item.extern_user_id,

        [this.cpI18nPipe.transform('student_id')]: item.student_id,

        [this.cpI18nPipe.transform('t_data_export_csv_walls_date_created')]: CPDate.fromEpoch(
          item.date_last_modified,
          this.session.tz
        ).format(Formats.dateFormat),

        [this.cpI18nPipe.transform('t_case_status')]: item.current_status.name
      };
    });
    createSpreadSheet(cases, columns);
  }
}

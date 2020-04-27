import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';
import { createSpreadSheet } from '@campus-cloud/shared/utils/csv';
import { IDataExport, DataExportType, IDataExportAppUsers } from './data-export.interface';

@Injectable({
  providedIn: 'root'
})
export class DataExportUtilsService {
  static readonly reports: IDataExport[] = [
    { type: DataExportType.appUsers, name: 't_data_export_app_users' }
  ];

  readonly fileDateSignature = moment().format('YYYY_MM_DD_HHmm');

  constructor(private cpI18n: CPI18nService, private session: CPSession) {}

  generateCSV(columns: string[], data: any[], fileName: string) {
    createSpreadSheet(data, columns, fileName);
  }

  createAppUsersCSV(data: IDataExportAppUsers[]) {
    const columns = {
      firstname: this.cpI18n.translate('first_name'),
      lastname: this.cpI18n.translate('last_name'),
      email: this.cpI18n.translate('email'),
      student_id: this.cpI18n.translate('student_id'),
      date_joined: this.cpI18n.translate('t_export_data_csv_app_users_registration_date'),
      last_login: this.cpI18n.translate('t_export_data_csv_app_users_last_activity')
    };

    const formattedData = data.map((d: IDataExportAppUsers) => {
      const { firstname, lastname, email, student_id, last_login, date_joined } = d;

      const dateJoined =
        date_joined > 0
          ? CPDate.fromEpoch(date_joined, this.session.tz).format('DD/MM/YYYY hh:mm:ssA')
          : '-';

      const lastLogin =
        last_login > 0
          ? CPDate.fromEpoch(last_login, this.session.tz).format('DD/MM/YYYY hh:mm:ssA')
          : '-';

      return {
        [columns.firstname]: firstname,
        [columns.lastname]: lastname,
        [columns.email]: email,
        [columns.student_id]: student_id,
        [columns.date_joined]: dateJoined,
        [columns.last_login]: lastLogin
      };
    });

    this.generateCSV(Object.values(columns), formattedData, `App_Users_${this.fileDateSignature}`);
  }
}

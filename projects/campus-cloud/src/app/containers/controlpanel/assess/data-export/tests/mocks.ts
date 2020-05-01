import { of } from 'rxjs';

import { IDataExportAppUsers } from './../data-export.interface';

export const mockDataExportAppUsers: IDataExportAppUsers = {
  status: 1,
  student_id: '1',
  lastname: 'paul',
  firstname: 'john',
  email: 'john@gmail.com',
  last_login: 1580832326,
  date_joined: 1580832277
};

export class MockDataExportService {
  placeholder;

  generateReportByType(type) {
    this.placeholder = type;
    return of(type);
  }
}

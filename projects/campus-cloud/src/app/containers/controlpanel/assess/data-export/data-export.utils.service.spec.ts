import { TestBed, async } from '@angular/core/testing';
import * as moment from 'moment';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { mockDataExportAppUsers } from './tests/mocks';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { DataExportUtilsService } from './data-export.utils.service';

describe('DataExportUtilsService', () => {
  let session: CPSession;
  let cpI18n: CPI18nService;
  let service: DataExportUtilsService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [CPTestModule]
    })));

  beforeEach(() => {
    service = TestBed.get(DataExportUtilsService);

    session = TestBed.get(CPSession);
    cpI18n = TestBed.get(CPI18nService);
  });

  it('should return reports', () => {
    expect(DataExportUtilsService.reports).toBeDefined();
    expect(DataExportUtilsService.reports.length).toBe(1);
  });

  it('should have right file signature', () => {
    expect(service.fileDateSignature).toBe(moment().format('YYYY_MM_DD_HHmm'));
  });

  describe('createAppUsersCSV', () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(service, 'generateCSV');
      service.createAppUsersCSV([mockDataExportAppUsers]);
    });

    it('should have right columns', () => {
      const [columns] = spy.calls.mostRecent().args;
      const expectedColumns = [
        cpI18n.translate('first_name'),
        cpI18n.translate('last_name'),
        cpI18n.translate('email'),
        cpI18n.translate('student_id'),
        cpI18n.translate('t_export_data_csv_app_users_registration_date'),
        cpI18n.translate('t_export_data_csv_app_users_last_activity')
      ];

      expectedColumns.forEach((c: string) => {
        expect(columns.includes(c)).toBe(true, `Missing column ${c}`);
      });
    });

    it('should have right file name', () => {
      const [, , fileName] = spy.calls.mostRecent().args;
      expect(fileName).toBe(`App_Users_${service.fileDateSignature}`);
    });

    it('should have right data', () => {
      const [, data] = spy.calls.mostRecent().args;
      const result = Object.values(data[0]);
      const expectedValues = [
        mockDataExportAppUsers.firstname,
        mockDataExportAppUsers.lastname,
        mockDataExportAppUsers.email,
        mockDataExportAppUsers.student_id,
        CPDate.fromEpoch(mockDataExportAppUsers.date_joined, session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        ),
        CPDate.fromEpoch(mockDataExportAppUsers.last_login, session.tz).format(
          'DD/MM/YYYY hh:mm:ssA'
        )
      ];

      expectedValues.forEach((v: string) => {
        expect(result.includes(v)).toBe(true, `Missing value ${v}`);
      });
    });
  });
});

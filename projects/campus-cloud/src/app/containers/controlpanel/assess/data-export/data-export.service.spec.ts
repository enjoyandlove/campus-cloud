import { TestBed, async } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { ApiService } from '@campus-cloud/base/services';
import { DataExportService } from './data-export.service';
import { CPI18nService } from '@campus-cloud/shared/services';

class MockApiService {}

describe('DataExportService', () => {
  let service: DataExportService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      providers: [CPSession, CPI18nService, { provide: ApiService, useClass: MockApiService }]
    })));

  beforeEach(() => {
    service = TestBed.get(DataExportService);
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { API } from '@campus-cloud/config/api';
import { CPSession } from '@campus-cloud/session';
import { IntegrationDataService } from './integration-data.service';
import { MockCPSession, mockSchool } from '@campus-cloud/session/mock';

describe('IntegrationDataService', () => {
  let service: IntegrationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        IntegrationDataService,
        {
          provide: CPSession,
          useClass: MockCPSession
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(IntegrationDataService);
    service.session.g.set('school', mockSchool);
  });

  it('should call integration_data endpoint', () => {
    const spy = spyOn(service, 'get');
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.INTEGRATION_DATA}/1;100`;
    const params = new HttpParams().set('school_id', mockSchool.id.toString());
    service.getIntegrationData();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, params, true);
  });
});

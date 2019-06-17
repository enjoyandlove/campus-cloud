import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { API } from '@campus-cloud/config/api';
import { IIntegrationData } from '../../models';
import { HTTPService } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';

@Injectable()
export class IntegrationDataService extends HTTPService {
  constructor(http: HttpClient, router: Router, public session: CPSession) {
    super(http, router);
  }

  getIntegrationData(): Observable<IIntegrationData[]> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.INTEGRATION_DATA}/1;100`;

    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.get<IIntegrationData[]>(url, params, true);
  }
}

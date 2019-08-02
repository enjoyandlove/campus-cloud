import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IIntegrationData } from '../../models';
import { ApiService } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';

@Injectable()
export class IntegrationDataService {
  constructor(private api: ApiService, public session: CPSession) {}

  getIntegrationData(): Observable<IIntegrationData[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.INTEGRATION_DATA}/1;100`;

    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    return this.api.get<IIntegrationData[]>(url, params, true);
  }
}

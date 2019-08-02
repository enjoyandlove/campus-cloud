import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { PersonaPermission } from './engagement.status';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class EngagementService {
  constructor(private api: ApiService) {}

  getServices(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/`;

    return this.api.post(url, body, search);
  }

  getLists(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  getPersona(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api
      .get(url, search, true)
      .pipe(
        map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden))
      );
  }

  getChartData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_ENGAGEMENT}/`;

    return this.api.get(url, search);
  }

  getEventsData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_EVENT}/`;

    return this.api.get(url, search);
  }

  getServicesData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_SERVICE}/`;

    return this.api.get(url, search);
  }

  getOrientationData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_ORIENTATION_EVENT}/`;

    return this.api.get(url, search);
  }
}

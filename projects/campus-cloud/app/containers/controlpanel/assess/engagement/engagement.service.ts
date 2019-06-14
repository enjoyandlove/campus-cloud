import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { PersonaPermission } from './engagement.status';
import { HTTPService } from '../../../../base/http.service';

@Injectable()
export class EngagementService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, EngagementService.prototype);
  }

  getServices(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search, true);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, search);
  }

  getLists(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search, true);
  }

  getPersona(startRange = 1, endRange = 1000, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super
      .get(url, search, true)
      .pipe(
        map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden))
      );
  }

  getChartData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_ENGAGEMENT}/`;

    return super.get(url, search);
  }

  getEventsData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}/`;

    return super.get(url, search);
  }

  getServicesData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super.get(url, search);
  }

  getOrientationData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_ORIENTATION_EVENT}/`;

    return super.get(url, search);
  }
}

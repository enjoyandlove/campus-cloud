import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@campus-cloud/config/api';
import { HTTPService } from '@campus-cloud/base/http.service';

@Injectable()
export class IntegrationsService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, IntegrationsService.prototype);
  }

  getIntegrations(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ANNOUNCEMENT_INTEGRATION
    }/${startRage};${endRage}`;

    return super.get(url, search, true);
  }

  createIntegration(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/`;

    return super.post(url, body, search, true);
  }

  editIntegration(integrationId: number, body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ANNOUNCEMENT_INTEGRATION
    }/${integrationId}`;

    return super.update(url, body, search, true);
  }

  deleteIntegration(integrationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ANNOUNCEMENT_INTEGRATION
    }/${integrationId}`;

    return super.delete(url, search, true);
  }

  syncNow(integrationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ANNOUNCEMENT_INTEGRATION
    }/${integrationId}`;

    return super.update(url, {}, search, true, 0);
  }
}

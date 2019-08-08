import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class IntegrationsService {
  constructor(private api: ApiService) {}

  getIntegrations(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/${startRage};${endRage}`;

    return this.api.get(url, search, true);
  }

  createIntegration(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/`;

    return this.api.post(url, body, search, true);
  }

  editIntegration(integrationId: number, body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/${integrationId}`;

    return this.api.update(url, body, search, true);
  }

  deleteIntegration(integrationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/${integrationId}`;

    return this.api.delete(url, search, true);
  }

  syncNow(integrationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT_INTEGRATION}/${integrationId}`;

    return this.api.update(url, {}, search, true, 0);
  }
}

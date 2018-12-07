import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base/http.service';

@Injectable()
export class ItemsIntegrationsService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ItemsIntegrationsService.prototype);
  }

  getIntegrations(startRage: number, endRage: number, search: HttpParams) {
    console.log('sopa');
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EVENT_INTEGRATIONS
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  createIntegration(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_INTEGRATIONS}/`;

    return super.post(url, body, search);
  }

  editIntegration(integrationId: number, body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EVENT_INTEGRATIONS
    }/${integrationId}`;

    return super.update(url, body, search);
  }

  deleteIntegration(integrationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EVENT_INTEGRATIONS
    }/${integrationId}`;

    return super.delete(url, search);
  }
}

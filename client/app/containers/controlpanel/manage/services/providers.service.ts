import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base/http.service';

@Injectable()
export class ProvidersService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ProvidersService.prototype);
  }

  getProviders(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  createProvider(data: any, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/`;

    return super.post(url, data, search);
  }

  updateProvider(data: any, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/`;

    return super.update(url, data, search);
  }

  deleteProvider(providerId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return super.delete(url, search);
  }

  getProviderByProviderId(providerId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return super.get(url, search);
  }

  getProviderAssessments(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_ASSESSMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }
}

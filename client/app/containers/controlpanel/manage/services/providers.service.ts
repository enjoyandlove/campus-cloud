import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class ProvidersService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ProvidersService.prototype);
  }

  getProviders(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createProvider(data: any, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/`;

    return super.post(url, data, { search }).map((res) => res.json());
  }

  updateProvider(data: any, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/`;

    return super.update(url, data, { search }).map((res) => res.json());
  }

  deleteProvider(providerId: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  getProviderByProviderId(providerId: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getProviderAssessments(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICE_ASSESSMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }
}

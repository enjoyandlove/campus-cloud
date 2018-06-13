import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/base.service';
import { SERVICES_MODAL_SET } from '../../../reducers/services-modal.reducer';

@Injectable()
export class AudienceService extends BaseService {
  constructor(http: Http, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceService.prototype);
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getAudiences(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getAudienceById(audienceId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  deleteAudience(audienceId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.delete(url, { search }).map((res) => res);
  }

  createAudience(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  updateAudience(audienceId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: SERVICES_MODAL_SET,
      payload: services
    });
  }
}

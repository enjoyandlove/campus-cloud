import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/base.service';
import { SERVICES_MODAL_SET } from '../../../reducers/services-modal.reducer';

@Injectable()
export class AudienceService extends BaseService {
  constructor(http: HttpClient, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceService.prototype);
  }

  getUsers(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, search);
  }

  getAudiences(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getAudienceById(audienceId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.get(url, search);
  }

  deleteAudience(audienceId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.delete(url, search, false, { responseType: 'text' });
  }

  createAudience(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, search);
  }

  updateAudience(audienceId: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.update(url, body, search);
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

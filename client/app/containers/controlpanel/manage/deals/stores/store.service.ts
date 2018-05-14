import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base';

@Injectable()
export class StoreService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StoreService.prototype);
  }

  getStores(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.DEALS_STORE
      }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createStore(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS_STORE}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  deleteStore(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS_STORE}/${id}`;

    return super.delete(url, { search }).map((res) => res.json());
  }
}

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

@Injectable()
export class DealsStoreService {
  constructor(private api: ApiService) {}

  getStores(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS_STORE}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  createStore(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS_STORE}/`;

    return this.api.post(url, body, search);
  }

  editStore(id: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS_STORE}/${id}`;

    return this.api.update(url, body, search);
  }

  deleteStore(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS_STORE}/${id}`;

    return this.api.delete(url, search);
  }
}

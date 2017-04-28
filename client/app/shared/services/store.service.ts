import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

@Injectable()
export class StoreService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StoreService.prototype);
  }

  getStores() {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/`;

    return super.get(url).map(res => res.json());
  }

  getStoreById(storeId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/${storeId}`;

    return super.get(url).map(res => res.json());
  }
}

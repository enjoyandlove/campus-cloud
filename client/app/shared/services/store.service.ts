import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

@Injectable()
export class StoreService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StoreService.prototype);
  }

  getStores(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/1;1000`;

    return super
      .get(url, { search })
      .map(res => res.json())
      .startWith([{ 'label': 'All Hosts' }])
      .map(res => {
        const stores = [
          {
            'label': 'All Hosts',
            'value': null
          }
        ];
        res.forEach(store => {
          stores.push({
            'label': store.name,
            'value': store.id
          });
        });
        return stores;
      });
  }

  getStoreById(storeId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/${storeId}`;

    return super.get(url).map(res => res.json());
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { CPSession } from '../../../../session';
import { StoreService } from './stores/store.service';
import { CPI18nService } from '../../../../shared/services';

@Injectable()
export class DealsService extends BaseService {
  constructor(
    http: Http,
    router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService,
  ) {
    super(http, router);

    Object.setPrototypeOf(this, DealsService.prototype);
  }

  getStores() {
    const key = 'deals_list_dropdown_label_all_stores';
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    return this.storeService
      .getStores(1, 10000, search)
      .startWith([{ label: this.cpI18n.translate(key) }])
      .map((stores) => {
        const _stores = [
          {
            label: this.cpI18n.translate(key),
            action: null
          }
        ];

        stores.forEach((store) => {
          const _store = {
            label: store.name,
            action: store.id
          };

          _stores.push(_store);
        });

        return _stores;
      });
  }

  getDeals(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createDeal(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editDeal(id: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  deleteDeal(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  getDealById(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.get(url, { search }).map((res) => res.json());
  }
}

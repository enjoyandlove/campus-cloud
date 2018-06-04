import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { CPSession } from '../../../../session';
import { StoreService } from './stores/store.service';
import { CPI18nService } from '../../../../shared/services';

export enum DateStatus {
  forever = -1
}

@Injectable()
export class DealsService extends BaseService {
  constructor(
    router: Router,
    http: HttpClient,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService
  ) {
    super(http, router);

    Object.setPrototypeOf(this, DealsService.prototype);
  }

  getStores(label = null) {
    const key =
      label === 'select'
        ? 't_deals_list_dropdown_label_select_store'
        : 't_deals_list_dropdown_label_all_stores';
    const search = new HttpParams();
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

  getDeals(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  createDeal(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/`;

    return super.post(url, body, search);
  }

  editDeal(id: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.update(url, body, search);
  }

  deleteDeal(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.delete(url, search);
  }

  getDealById(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DEALS}/${id}`;

    return super.get(url, search);
  }
}

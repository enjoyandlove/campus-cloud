import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base';
import { CPSession } from '../../../../session';
import { DealsStoreService } from './stores/store.service';
import { CPI18nService } from '../../../../shared/services';

export enum DateStatus {
  noDate = 0,
  forever = -1
}

@Injectable()
export class DealsService extends HTTPService {
  constructor(
    router: Router,
    http: HttpClient,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: DealsStoreService
  ) {
    super(http, router);

    Object.setPrototypeOf(this, DealsService.prototype);
  }

  getDealStores() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    return this.storeService.getStores(1, 10000, search).pipe(
      map((stores: any[]) => {
        const _stores = [];

        stores.forEach((store: any) => {
          const _store = {
            label: store.name,
            action: store.id
          };

          _stores.push(_store);
        });

        return _stores;
      })
    );
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

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { ApiService } from '@campus-cloud/base/services';
import { DealsStoreService } from './stores/store.service';
import { CPI18nService } from '@campus-cloud/shared/services';

export enum DateStatus {
  noDate = 0,
  forever = -1
}

@Injectable()
export class DealsService {
  constructor(
    private api: ApiService,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: DealsStoreService
  ) {}

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
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  createDeal(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS}/`;

    return this.api.post(url, body, search);
  }

  editDeal(id: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS}/${id}`;

    return this.api.update(url, body, search);
  }

  deleteDeal(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS}/${id}`;

    return this.api.delete(url, search);
  }

  getDealById(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DEALS}/${id}`;

    return this.api.get(url, search);
  }
}

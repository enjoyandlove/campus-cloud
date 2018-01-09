import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { API } from '../../config/api';

import { BaseService } from '../../base/base.service';

import { CPI18nService } from './i18n.service';

const cpI18n = new CPI18nService();

@Injectable()
export class StoreService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StoreService.prototype);
  }

  private getServices(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.SERVICES
    }/1;1000`;

    return super
      .get(url, { search })
      .map((res) => res.json())
      .startWith([
        {
          label: cpI18n.translate('services'),
          value: null,
          heading: true,
        },
      ])
      .map((res) => {
        const services = [
          {
            label: cpI18n.translate('services'),
            value: null,
            heading: true,
          },
        ];

        const _services = res.map((store) => {
          return {
            label: store.name,
            value: store.store_id,
            heading: false,
          };
        });

        if (_services.length) {
          services.push(..._services);
        }

        return services.length === 1 ? [] : services;
      });
  }

  private getClubs(search: URLSearchParams) {
    const ACTIVE_CLUBS = '1';
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CLUBS
    }/1;1000`;

    if (!search) {
      search = new URLSearchParams();
      search.append('status', ACTIVE_CLUBS);
    } else {
      search.append('status', ACTIVE_CLUBS);
    }

    return super
      .get(url, { search })
      .map((res) => res.json())
      .startWith([
        {
          label: cpI18n.translate('clubs'),
          value: null,
          heading: true,
        },
      ])
      .map((res) => {
        const clubs = [
          {
            label: cpI18n.translate('clubs'),
            value: null,
            heading: true,
          },
        ];

        const _clubs = res.map((store) => {
          return {
            label: store.name,
            value: store.id,
            heading: false,
          };
        });

        if (_clubs.length) {
          clubs.push(..._clubs);
        }

        return clubs.length === 1 ? [] : clubs;
      });
  }

  getStores(
    search: URLSearchParams,
    placeHolder = cpI18n.translate('select_host'),
  ) {
    const clubs$ = this.getClubs(search);
    const services$ = this.getServices(search);

    return Observable.combineLatest(services$, clubs$).map((res) => {
      if (!res[0].length && !res[1].length) {
        return [
          {
            value: null,
            heading: true,
            disabled: true,
            label: cpI18n.translate('select_host'),
            tooltipText: cpI18n.translate('error_no_hosts_found_help'),
          },
        ];
      }

      return [
        {
          label: placeHolder,
          value: null,
          heading: false,
        },
        ...res[0],
        ...res[1],
      ];
    });
  }

  getStoreById(storeId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.STORE
    }/${storeId}`;

    return super.get(url).map((res) => res.json());
  }
}

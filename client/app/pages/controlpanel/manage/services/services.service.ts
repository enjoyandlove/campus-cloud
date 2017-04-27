import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';
import { SERVICES_MODAL_SET } from '../../../../reducers/services-modal.reducer';

@Injectable()
export class ServicesService extends BaseService {
  constructor(
    http: Http,
    router: Router,
    private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ServicesService.prototype);
  }

  getServices(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getServiceById(serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${serviceId}`;

    return super.get(url).map(res => res.json());
  }

  deleteService(serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${serviceId}`;

    return super.delete(url).map(res => res.json());
  }

  createService(data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/`;

    return super.post(url, data).map(res => res.json());
  }

  updateService(data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/`;

    return super.update(url, data).map(res => res.json());
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: SERVICES_MODAL_SET,
      payload: services
    });
  }
}

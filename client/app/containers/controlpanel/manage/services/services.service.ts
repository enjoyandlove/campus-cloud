import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { baseActions } from '../../../../store/base';
import { HTTPService } from '../../../../base/http.service';

@Injectable()
export class ServicesService extends HTTPService {
  constructor(http: HttpClient, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ServicesService.prototype);
  }

  getServices(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getCategories() {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES_CATEGORY}/1;1000`;

    return super.get(url);
  }

  getServiceById(serviceId: number, start?: number, end?: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${serviceId}`;

    let dates;
    if (start && end) {
      dates = new HttpParams().append('start', start.toString()).append('end', end.toString());
    }

    return super.get(url, dates);
  }

  deleteService(serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${serviceId}`;

    return super.delete(url);
  }

  createService(data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/`;

    return super.post(url, data);
  }

  updateService(data: any, serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${serviceId}`;

    return super.update(url, data);
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: baseActions.SERVICES_MODAL_SET,
      payload: services
    });
  }
}

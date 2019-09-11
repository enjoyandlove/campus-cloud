import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { baseActions } from '@campus-cloud/store';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class ServicesService {
  constructor(private api: ApiService, private store: Store<any>) {}

  getServices(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  getCategories() {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES_CATEGORY}/1;1000`;

    return this.api.get(url);
  }

  getServiceById(serviceId: number, start?: number, end?: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/${serviceId}`;

    let dates;
    if (start && end) {
      dates = new HttpParams().append('start', start.toString()).append('end', end.toString());
    }

    return this.api.get(url, dates, true);
  }

  getServiceAttendanceSummary(serviceId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/${serviceId}`;

    return this.api.get(url, search);
  }

  deleteService(serviceId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/${serviceId}`;

    return this.api.delete(url, null, true);
  }

  createService(data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/`;

    return this.api.post(url, data, null, true);
  }

  updateService(data: any, serviceId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}/${serviceId}`;

    return this.api.update(url, data, null, true);
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: baseActions.SERVICES_MODAL_SET,
      payload: services
    });
  }
}

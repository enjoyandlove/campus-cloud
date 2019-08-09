import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class CheckinService {
  constructor(public api: ApiService) {}

  getServiceData(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return this.api.get(url, search, silent);
  }

  getEventData(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return this.api.get(url, search, silent);
  }

  doEventCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return this.api.update(url, data, search, silent);
  }

  doServiceCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return this.api.update(url, data, search, silent);
  }
}

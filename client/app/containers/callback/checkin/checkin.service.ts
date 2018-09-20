import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CallbackService } from '../callback.service';

@Injectable()
export class CheckinService extends CallbackService {
  constructor(public _http: HttpClient, public _router: Router) {
    super(_http, _router);
  }

  getServiceData(search: HttpParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return super.get(url, search, silent);
  }

  getEventData(search: HttpParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return super.get(url, search, silent);
  }

  doEventCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return super.update(url, data, search, silent);
  }

  doServiceCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return super.update(url, data, search, silent);
  }
}

import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CallbackService } from '../callback.service';

@Injectable()
export class CheckinService extends CallbackService {
  constructor(public _http: Http, public _router: Router) {
    super(_http, _router);
  }

  getServiceData(search: URLSearchParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return super.get(url, { search }, silent).map((res) => res.json());
  }

  getEventData(search: URLSearchParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return super.get(url, { search }, silent).map((res) => res.json());
  }

  doEventCheckin(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_CHECKIN}/`;

    return super.update(url, data, { search }).map((res) => res.json());
  }

  doServiceCheckin(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_CHECKIN}/`;

    return super.update(url, data, { search }).map((res) => res.json());
  }
}

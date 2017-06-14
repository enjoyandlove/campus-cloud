import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CallbackService } from '../callback.service';

@Injectable()
export class FeedbackService extends CallbackService {

  constructor(
    public _http: Http,
    public _router: Router
  ) {
    super(_http, _router);
  }

  getServiceData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getEventData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  doEventFeedback(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return super.update(url, data, { search }).map(res => res.json());
  }

  doServiceFeedback(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return super.update(url, data, { search }).map(res => res.json());
  }
}

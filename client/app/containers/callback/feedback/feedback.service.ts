import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CallbackService } from '../callback.service';

@Injectable()
export class FeedbackService extends CallbackService {
  constructor(public _http: HttpClient, public _router: Router) {
    super(_http, _router);
  }

  getServiceData(search: HttpParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return super.get(url, search, silent);
  }

  getEventData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return super.get(url, search);
  }

  doEventFeedback(data: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return super.update(url, data, search);
  }

  doServiceFeedback(data: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return super.update(url, data, search);
  }
}

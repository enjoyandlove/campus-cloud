import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { FeedbackService } from './feedback.service';

@Injectable()
export class OrientationFeedbackService extends FeedbackService {
  constructor(public _http: HttpClient, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return super.get(url, search);
  }

  doEventFeedback(data: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return super.update(url, data, search);
  }
}

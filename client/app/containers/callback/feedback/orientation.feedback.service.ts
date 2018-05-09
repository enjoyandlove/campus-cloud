import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { FeedbackService } from './feedback.service';

@Injectable()
export class OrientationFeedbackService extends FeedbackService {
  constructor(public _http: Http, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  doEventFeedback(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return super.update(url, data, { search }).map((res) => res.json());
  }
}

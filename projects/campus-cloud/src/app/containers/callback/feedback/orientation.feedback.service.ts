import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FeedbackService } from './feedback.service';
import { CallbackService } from './../callback.service';

@Injectable()
export class OrientationFeedbackService extends FeedbackService {
  constructor(public api: CallbackService) {
    super(api);
  }

  getEventData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return this.api.get(url, search);
  }

  doEventFeedback(data: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_USER_EVENT_FEEDBACK}/`;

    return this.api.update(url, data, search);
  }
}

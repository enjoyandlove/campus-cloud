import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CheckinService } from './checkin.service';

@Injectable()
export class OrientationCheckinService extends CheckinService {

  constructor(public _http: Http, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: URLSearchParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN
      }/`;

    return super.get(url, { search }, silent).map((res) => res.json());
  }

  doEventCheckin(data: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN
      }/`;

    return super.update(url, data, { search }).map((res) => res.json());
  }
}

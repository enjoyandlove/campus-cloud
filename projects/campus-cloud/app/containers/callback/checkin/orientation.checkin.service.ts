import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { CheckinService } from './checkin.service';

@Injectable()
export class OrientationCheckinService extends CheckinService {
  constructor(public _http: HttpClient, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: HttpParams, silent) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN}/`;

    return super.get(url, search, silent);
  }

  doEventCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN}/`;

    return super.update(url, data, search, silent);
  }
}

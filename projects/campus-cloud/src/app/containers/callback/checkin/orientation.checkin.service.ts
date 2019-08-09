import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CheckinService } from './checkin.service';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class OrientationCheckinService extends CheckinService {
  constructor(public api: ApiService) {
    super(api);
  }

  getEventData(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN}/`;

    return this.api.get(url, search, silent);
  }

  doEventCheckin(data: any, search: HttpParams, silent = false) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_USER_EVENT_CHECKIN}/`;

    return this.api.update(url, data, search, silent);
  }
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class EventsService extends BaseService {
  constructor(http: Http) {
    super(http);

    Object.setPrototypeOf(this, EventsService.prototype);
  }

  getEvents() {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;
    return super.get(url).map(res => res.json());
  }
}

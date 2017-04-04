import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base/base.service';

@Injectable()
export class ClubsEventsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ClubsEventsService.prototype);
  }

  getEventsByClubId(clubId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}/${clubId}`;

    return super.get(url).map(res => res.json());
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }
}

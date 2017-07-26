import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class EngagementService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, EngagementService.prototype);
  }

  getRandomNumber(upperlimit, maxAllowed = 1000) {
    let arr = [];

    for (let i = 1; i <= upperlimit; i++) {
      arr.push(Math.floor(Math.random() * maxAllowed));
    }

    return arr;
  }

  getServices(startRange = 1, endRange = 1000, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  postAnnouncements(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, { search }).map(res => res.json());
  }

  getLists(startRange = 1, endRange = 1000, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getChartData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_ENGAGEMENT}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getEventsData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getServicesData(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}`;

    return super.get(url, { search }).map(res => res.json());
  }
}

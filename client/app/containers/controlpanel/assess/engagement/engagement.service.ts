import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

  getLists(startRange = 1, endRange = 1000, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getChartData(search?: URLSearchParams) {
    const DATE_TYPES = [7, 30, 49, 90];
    // const DATE_TYPES = [7];
    let no_engagement = this.getRandomNumber(Math.floor(Math.random() * 100));
    let one_engagement = this.getRandomNumber(Math.floor(Math.random() * 100));
    let repeat_engagement = this.getRandomNumber(Math.floor(Math.random() * 100));

    let chart_data = this.getRandomNumber(
      DATE_TYPES[Math.floor(Math.random() * DATE_TYPES.length)],
      200
    );

    let data = {
      chart_data,
      no_engagement,
      one_engagement,
      repeat_engagement
    };

    return Observable.of(data).delay(1000);
  }

  getEventsData(search: URLSearchParams) {
    return Observable.of(search).delay(1000);
  }

  getServicesData(search: URLSearchParams) {
    return Observable.of(search).delay(1000);
  }
}

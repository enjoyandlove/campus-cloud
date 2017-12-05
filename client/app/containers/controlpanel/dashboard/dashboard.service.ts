import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/index';

@Injectable()
export class DashboardService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DashboardService.prototype);
  }

  getDownloads(startRange: number, endRange: number) {
    console.log(startRange, endRange);
    return Observable.of([]);
  }

  getAssessment(startRange: number, endRange: number) {
    console.log(startRange, endRange);
    return Observable.of([]).delay(560);
  }

  getIntegrations(startRange: number, endRange: number) {
    console.log(startRange, endRange);
    return Observable.of([]).delay(560);
  }

  getGeneralInformation(startRange: number, endRange: number) {
    console.log(startRange, endRange);
    return Observable.of([]).delay(2300);
  }

  getTopEvents(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getTopServices(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super.get(url, { search }).map(res => res.json());
  }
}

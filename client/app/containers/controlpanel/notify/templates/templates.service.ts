import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class TemplatesService extends BaseService {
  constructor(
    http: Http,
    router: Router
  ) {
    super(http, router);

    Object.setPrototypeOf(this, TemplatesService.prototype);
  }

  getTemplates(startRange: number, endRange: number, search: URLSearchParams) {
    console.log(search, startRange, endRange);

    const mockResponse = Observable.of([
      {
        name: 'Active Shooter',
        to: 'Campus-Wide',
        subject: 'Active Shooter on Campus',
        body: 'Shelter in place immediately'
      },
      {
        name: 'Severe Weather on Warning',
        to: 'McDonald Campus',
        subject: 'Weather Warning',
        body: 'Campus wide closure due to [WEATHER CONDITION]'
      }
    ]);
    return mockResponse.delay(1000);
  }
}

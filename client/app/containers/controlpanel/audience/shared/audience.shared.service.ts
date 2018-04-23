import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class AudienceSharedService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceSharedService.prototype);
  }

  getDynamic(): Observable<any> {
    return Observable.of([
      {
        id: 36,
        title_text: 'Ethnicity',
        choices: ['White', 'Black', 'Hispanic', 'Asian', 'American Indian', 'Pacific Islander']
      },
      {
        id: 37,
        title_text: 'Year of Study',
        choices: ['First', 'Second', 'Third', 'Fourth']
      }
    ]).delay(400);
  }

  getAudience(startRange: number, endRange: number, search: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map((res) => res.json());
  }
}

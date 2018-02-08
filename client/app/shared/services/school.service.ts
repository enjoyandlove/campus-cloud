import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { BaseService } from '../../base/base.service';
import { API } from '../../config/api';

@Injectable()
export class SchoolService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, SchoolService.prototype);
  }

  getSchools(startRange = 1, endRange = 100) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.SCHOOL
    }/${startRange};${endRange}`;

    return super.get(url).map((res) => res.json());
  }
}

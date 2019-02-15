import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base';

@Injectable()
export class DiningService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DiningService.prototype);
  }

  getDining(startRange: number, endRange: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
      }/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getDiningById(diningId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/${diningId}`;

    return super.get(url, search, true);
  }

  createDining(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/`;

    return super.post(url, body, search);
  }

  deleteDiningById(diningId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/${diningId}`;

    return super.delete(url, search);
  }
}

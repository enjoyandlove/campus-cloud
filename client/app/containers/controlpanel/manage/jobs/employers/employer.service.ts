import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base';

@Injectable()
export class EmployerService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, EmployerService.prototype);
  }

  getEmployers(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.EMPLOYER
    }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createEmployer(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EMPLOYER}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editEmployer(id: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EMPLOYER}/${id}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  deleteEmployer(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EMPLOYER}/${id}`;

    return super.delete(url, { search }).map((res) => res.json());
  }
}

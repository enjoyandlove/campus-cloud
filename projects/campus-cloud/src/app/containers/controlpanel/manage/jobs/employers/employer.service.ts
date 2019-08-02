import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class EmployerService {
  constructor(private api: ApiService) {}

  getEmployers(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EMPLOYER}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  createEmployer(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EMPLOYER}/`;

    return this.api.post(url, body, search);
  }

  editEmployer(id: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EMPLOYER}/${id}`;

    return this.api.update(url, body, search);
  }

  deleteEmployer(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EMPLOYER}/${id}`;

    return this.api.delete(url, search);
  }
}

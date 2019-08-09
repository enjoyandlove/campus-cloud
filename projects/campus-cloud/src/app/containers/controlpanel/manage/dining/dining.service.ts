import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

@Injectable()
export class DiningService {
  constructor(private api: ApiService) {}

  getDining(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getDiningById(diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    return this.api.get(url, search, true);
  }

  createDining(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/`;

    return this.api.post(url, body, search, true);
  }

  updateDining(body, diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    return this.api.update(url, body, search, true);
  }

  deleteDiningById(diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    return this.api.delete(url, search);
  }
}

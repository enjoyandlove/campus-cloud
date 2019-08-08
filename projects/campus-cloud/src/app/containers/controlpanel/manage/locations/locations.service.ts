import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

export enum Acronym {
  'yes' = 'Yes',
  'no' = 'No'
}

export const hasAcronym = (val) => (val ? Acronym.yes : Acronym.no);

@Injectable()
export class LocationsService {
  constructor(private api: ApiService) {}

  getLocations(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getLocationById(locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

    return this.api.get(url, search);
  }

  updateLocation(body, locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

    return this.api.update(url, body, search);
  }

  createLocation(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/`;

    return this.api.post(url, body, search);
  }

  deleteLocationById(locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

    return this.api.delete(url, search);
  }
}

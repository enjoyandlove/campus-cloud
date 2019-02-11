import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base/http.service';

export enum Acronym {
  'yes' = 'Yes',
  'no' = 'No'
}

export enum LocationType {
  'dining' = 'dining',
  'location' = 'location'
}

export const hasAcronym = (val) => (val ? Acronym.yes : Acronym.no);

@Injectable()
export class LocationsService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, LocationsService.prototype);
  }

  getLocations(startRange: number, endRange: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
    }/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getLocationById(locationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/${locationId}`;

    return super.get(url, search);
  }

  updateLocation(body, locationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/${locationId}`;

    return super.update(url, body, search);
  }

  createLocation(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/`;

    return super.post(url, body, search);
  }

  deleteLocationById(locationId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/${locationId}`;

    return super.delete(url, search);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class LocationsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, LocationsService.prototype);
  }

  getLocations(startRange: number, endRange: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
    }/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getLocationById(locationId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
    }/${locationId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  updateLocation(body, locationId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
    }/${locationId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  createLocation(body, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LOCATIONS}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  deleteLocationById(locationId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.LOCATIONS
    }/${locationId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }
}

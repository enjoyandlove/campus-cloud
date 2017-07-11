import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockLocations = require('./mock.json');

@Injectable()
export class LocationsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, LocationsService.prototype);
  }

  // getUploadImageUrl() {
  //   return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  // }

  getLocations() {
    const promise = new Promise(resolve => {
      setTimeout(() => { resolve(mockLocations); }, 700);
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  getLocationById(locationId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${locationId}`;

    return super.get(url).map(res => res.json());
  }

  updateLocation(body, locationId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${locationId}`;

    return super.update(url, body).map(res => res.json());
  }

  createLocation(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body).map(res => res.json());
  }

  deleteLocation(locationId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${locationId}`;

    return super.delete(url).map(res => res.json());
  }
}

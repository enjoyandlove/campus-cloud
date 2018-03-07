import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';

@Injectable()
export class OrientationService extends BaseService {
  dummy;
  mockJson = require('./mock.json');

  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, OrientationService.prototype);
  }

  getOrientationPrograms(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getOrientationProgramById(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createOrientationProgram(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editOrientationProgram(programId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  deleteOrientationProgram(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  duplicateOrientationProgram(programId: number, body: any, search: URLSearchParams) {
    this.dummy = [programId, body, search];

    return Observable.of(body).delay(300);
  }
}

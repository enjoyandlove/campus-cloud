import { URLSearchParams, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';

@Injectable()
export class OrientationService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, OrientationService.prototype);
  }

  getPrograms(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
    }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getProgramById(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createProgram(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editProgram(programId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  deleteProgram(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  duplicateProgram(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }
}

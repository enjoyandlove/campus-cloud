import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';

@Injectable()
export class OrientationService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, OrientationService.prototype);
  }

  getPrograms(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getProgramById(programId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.get(url, search);
  }

  createProgram(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, search);
  }

  editProgram(programId: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.update(url, body, search);
  }

  deleteProgram(programId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/${programId}`;

    return super.delete(url, search);
  }

  duplicateProgram(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, search);
  }
}

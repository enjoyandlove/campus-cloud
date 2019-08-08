import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class OrientationService {
  constructor(private api: ApiService) {}

  getPrograms(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  getProgramById(programId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/${programId}`;

    return this.api.get(url, search);
  }

  createProgram(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/`;

    return this.api.post(url, body, search);
  }

  editProgram(programId: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/${programId}`;

    return this.api.update(url, body, search);
  }

  deleteProgram(programId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/${programId}`;

    return this.api.delete(url, search);
  }

  duplicateProgram(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION}/`;

    return this.api.post(url, body, search);
  }
}

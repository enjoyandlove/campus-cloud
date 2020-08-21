import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

@Injectable()
export class CasesService {
  constructor(private api: ApiService, private http: HttpClient) {}

  getCaseStatus(search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE_STATUS}/`;
    return this.api.get(url, search);
  }

  getCases(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE}/`;
    return this.api.get(url, search);
  }

  getCaseById(caseId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE}/${caseId}`;

    return this.api.get(url, search);
  }

  updateCase(body, caseId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE}/${caseId}`;

    return this.api.update(url, body, search);
  }

  createCase(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE}/`;
    return this.api.post(url, body, search);
  }

  deleteCaseById(caseId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CASE}/${caseId}`;

    return this.api.delete(url, search);
  }
}

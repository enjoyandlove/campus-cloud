import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

@Injectable()
export class ApiManagementService {
  constructor(private api: ApiService) {}

  getTokens(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PUBLIC_ACCESS_TOKEN}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  getTokenById(tokenId: string) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PUBLIC_ACCESS_TOKEN}/${tokenId}`;

    return this.api.get(url, null, true);
  }

  postToken(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PUBLIC_ACCESS_TOKEN}/`;

    return this.api.post(url, body, null, true);
  }

  editToken(tokenId: string, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PUBLIC_ACCESS_TOKEN}/${tokenId}`;

    return this.api.update(url, body, null, true);
  }

  deleteToken(tokenId: string, params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PUBLIC_ACCESS_TOKEN}/${tokenId}`;

    return this.api.delete(url, params, true);
  }
}

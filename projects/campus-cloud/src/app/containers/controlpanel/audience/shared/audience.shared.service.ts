import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class AudienceSharedService {
  constructor(private api: ApiService) {}

  getFilters(search: HttpParams): Observable<any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.AUDIENCE_FILTERS}/`;

    return this.api.get(url, search);
  }

  getUserCount(body, search: HttpParams): Observable<any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/`;

    return this.api.post(url, body, search);
  }

  getAudience(startRange: number, endRange: number, search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}`;

    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getUsers(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}/`;

    return this.api.get(url, search);
  }
}

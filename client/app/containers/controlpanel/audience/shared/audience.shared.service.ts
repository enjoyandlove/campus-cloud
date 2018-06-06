import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../base/base.service';
import { API } from '../../../../config/api';

@Injectable()
export class AudienceSharedService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceSharedService.prototype);
  }

  getFilters(search: HttpParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.AUDIENCE_FILTERS}/`;

    return super.get(url, search);
  }

  getUserCount(body, search: HttpParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, search);
  }

  getAudience(startRange: number, endRange: number, search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getUsers(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, search);
  }
}

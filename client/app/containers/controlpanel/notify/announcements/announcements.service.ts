import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseService } from '../../../../base/base.service';
import { API } from '../../../../config/api';

@Injectable()
export class AnnouncementsService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AnnouncementsService.prototype);
  }

  getUsers(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, search);
  }

  createAudience(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, search);
  }

  getLists(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getAnnouncements(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, search);
  }

  deleteAnnouncement(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/${id}`;

    return super.delete(url, search).map((res) => res);
  }
}

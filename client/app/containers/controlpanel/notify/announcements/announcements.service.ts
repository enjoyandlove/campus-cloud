import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { BaseService } from '../../../../base/base.service';
import { API } from '../../../../config/api';

@Injectable()
export class AnnouncementsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AnnouncementsService.prototype);
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createAudience(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  getLists(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getAnnouncements(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  postAnnouncements(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  deleteAnnouncement(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/${id}`;

    return super.delete(url, { search }).map((res) => res);
  }
}

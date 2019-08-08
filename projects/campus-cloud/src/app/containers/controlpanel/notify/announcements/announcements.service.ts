import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class AnnouncementsService {
  constructor(private api: ApiService) {}

  getUsers(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}/`;

    return this.api.get(url, search);
  }

  createAudience(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/`;

    return this.api.post(url, body, search);
  }

  getLists(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getAnnouncements(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/`;

    return this.api.post(url, body, search);
  }

  deleteAnnouncement(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/${id}`;

    return this.api.delete(url, search);
  }
}

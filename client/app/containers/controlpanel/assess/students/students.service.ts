import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class StudentsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StudentsService.prototype);
  }

  getLists(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  postAnnouncements(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, { search }).map(res => res.json());
  }

  getStudentById(search: URLSearchParams, studentId: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${studentId}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getEngagements(search: URLSearchParams, studentId: number, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_ENGAGEMENT}`;

    const url = `${common}/${studentId}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getStudentsByList(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }
}

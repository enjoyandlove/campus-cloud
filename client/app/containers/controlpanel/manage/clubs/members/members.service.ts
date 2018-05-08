import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';

import { BaseService } from '../../../../../base/base.service';

@Injectable()
export class MembersService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, MembersService.prototype);
  }

  getMembers(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getSocialGroupDetails(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/`;

    return super.get(url, search);
  }

  removeMember(body: any, memberId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/${memberId}`;

    return super.update(url, body);
  }

  addMember(body: any, memberId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/${memberId}`;

    return super.update(url, body);
  }
}

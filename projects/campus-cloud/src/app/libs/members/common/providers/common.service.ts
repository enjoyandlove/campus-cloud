import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class LibsCommonMembersService {
  constructor(private api: ApiService) {}

  getMembers(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getSocialGroupDetails(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_GROUP}/`;

    return this.api.get(url, search);
  }

  removeMember(body: any, memberId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}/${memberId}`;

    return this.api.update(url, body);
  }

  addMember(body: any, memberId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}/${memberId}`;

    return this.api.update(url, body);
  }
}

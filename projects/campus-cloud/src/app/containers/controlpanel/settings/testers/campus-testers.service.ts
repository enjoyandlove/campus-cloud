import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class CampusTestersService {
  constructor(private api: ApiService, public session: CPSession) {}

  getUsers(startRage: number, endRage: number, search: HttpParams = new HttpParams()) {
    search = search.set('client_id', this.session.g.get('school').client_id);

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_ACCESS_LEVEL}/${startRage};${endRage}`;

    return this.api.get(url, search, true);
  }

  resendInvite(testerId) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_ACCESS_LEVEL}/${testerId}`;
    const body = { resend_email: 1 };

    return this.api.update(url, body, null, true);
  }

  deleteUser(testerId) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_ACCESS_LEVEL}/${testerId}`;

    return this.api.delete(url, null, true);
  }

  createUsers(emails) {
    const client_id = this.session.g.get('school').client_id;
    const access_level = 1;
    const body = {
      client_id,
      access_level,
      emails
    };

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_ACCESS_LEVEL}/`;

    return this.api.post(url, body, null, true);
  }
}

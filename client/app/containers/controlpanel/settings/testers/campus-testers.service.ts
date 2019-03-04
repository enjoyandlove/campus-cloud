import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base';
import { CPSession } from '@app/session';

@Injectable()
export class CampusTestersService extends HTTPService {
  constructor(http: HttpClient, router: Router, public session: CPSession) {
    super(http, router);

    Object.setPrototypeOf(this, CampusTestersService.prototype);
  }

  getUsers(startRage: number, endRage: number, search: HttpParams = new HttpParams()) {
    search = search.set('client_id', this.session.g.get('school').client_id);

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.USER_ACCESS_LEVEL
    }/${startRage};${endRage}`;

    return super.get(url, search, true);
  }

  resendInvite(testerId) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_ACCESS_LEVEL}/${testerId}`;
    const body = { resend_email: 1 };

    return super.update(url, body, null, true);
  }

  deleteUser(testerId) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_ACCESS_LEVEL}/${testerId}`;

    return super.delete(url, null, true);
  }
}

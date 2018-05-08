import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API } from '../../config/api';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const headers = new HttpHeaders();

    const authorization = `${API.AUTH_HEADER.TOKEN} ${API.KEY}:${email}:${password}`;

    headers.set('Authorization', authorization);
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SESSION}/`;

    return this.http.post(url, {}, { headers });
  }

  submitPasswordReset(body) {
    const headers = new HttpHeaders();

    const authorization = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

    headers.set('Authorization', authorization);
    headers.set('Content-Type', 'application/json');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.P_RESET}/`;

    return this.http.put(url, body, { headers });
  }

  createInvitePassword(body: any) {
    const headers = new HttpHeaders();

    const authorization = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

    headers.set('Authorization', authorization);
    headers.set('Content-Type', 'application/json');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.P_RESET}/`;

    return this.http.put(url, body, { headers });
  }
}

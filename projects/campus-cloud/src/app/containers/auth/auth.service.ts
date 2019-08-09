import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private api: ApiService) {}

  login(email: string, password: string) {
    const authorization = `${this.api.AUTH_HEADER.TOKEN} ${this.api.KEY}:${email}:${password}`;

    const headers = new HttpHeaders({
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SESSION}/`;

    return this.http.post(url, {}, { headers });
  }

  submitPasswordReset(body) {
    const authorization = `${this.api.AUTH_HEADER.TOKEN} ${this.api.KEY}`;

    const headers = new HttpHeaders({
      Authorization: authorization,
      'Content-Type': 'application/json'
    });

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.P_RESET}/`;

    return this.http.put(url, body, { headers });
  }

  createInvitePassword(body: any) {
    const authorization = `${this.api.AUTH_HEADER.TOKEN} ${this.api.KEY}`;

    const headers = new HttpHeaders({
      Authorization: authorization,
      'Content-Type': 'application/json'
    });

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.P_RESET}/`;

    return this.http.put(url, body, { headers });
  }
}

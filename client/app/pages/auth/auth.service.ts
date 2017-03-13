import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { API } from '../../config/api';

@Injectable()
export class AuthService {
  constructor(private http: Http) {}

  login(email: string, password: string) {
    let headers = new Headers();

    const authorization = `${API.AUTH_HEADER.TOKEN} ${API.KEY}:${email}:${password}`;

    headers.set('Authorization', authorization);
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SESSION}`;

    return this.http.post(url, {}, { headers }).map(res => res.json());
  }

  submitPasswordReset(body) {
    let headers = new Headers();

    const authorization = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

    headers.set('Authorization', authorization);
    headers.set('Content-Type', 'application/json');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.P_RESET}`;

    return this.http.put(url, body, { headers }).map(res => res);
  }
}

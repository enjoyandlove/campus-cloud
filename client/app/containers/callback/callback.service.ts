import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPService } from '../../base/http.service';
import { API } from '../../config/api';

const buildTokenHeaders = () => {
  const auth = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: auth
  });
};

@Injectable()
export class CallbackService extends HTTPService {
  constructor(public http: HttpClient, public router: Router) {
    super(http, router, buildTokenHeaders());
  }
}

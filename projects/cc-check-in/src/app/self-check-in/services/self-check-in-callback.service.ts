import { Injectable } from '@angular/core';
import { ApiService } from '@campus-cloud/base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EnvService } from '@campus-cloud/config/env';
import { environment } from '@projects/cc-check-in/src/environments/environment';
import { ENDPOINTS } from './endpoints';

@Injectable({
  providedIn: 'root'
})
export class SelfCheckInCallbackService extends ApiService {
  readonly OTokeKEY = environment.keys.nsApiKey;
  readonly SELF_CHECK_IN_ENDPOINTS = ENDPOINTS;

  constructor(http: HttpClient, router: Router, env: EnvService) {
    super(http, router, env);
  }

  getHeaders() {
    const auth = `OToke ${this.OTokeKEY}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }
}

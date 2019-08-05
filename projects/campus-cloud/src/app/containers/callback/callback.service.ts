import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';
import { ENDPOINTS } from '../../base/services/api/endpoints';
import { HTTPService, ApiService } from '@campus-cloud/base/services';
import { environment } from '@projects/campus-cloud/src/environments/environment.prod';

@Injectable()
export class CallbackService extends HTTPService {
  readonly BASE_URL = this.env.apiUrl;

  readonly KEY = environment.keys.readyApiKey;

  readonly VERSION = {
    V1: 'v1'
  };

  readonly ENDPOINTS = ENDPOINTS;

  constructor(http: HttpClient, router: Router, private env: EnvService, private api: ApiService) {
    super(http, router);
  }

  getHeaders() {
    const auth = `CCToke ${this.api.KEY}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }
}

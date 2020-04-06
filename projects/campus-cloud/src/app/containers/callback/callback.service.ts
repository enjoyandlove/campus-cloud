import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';
import { ApiService } from '@campus-cloud/base/services';

@Injectable({ providedIn: 'root' })
export class CallbackService extends ApiService {
  constructor(http: HttpClient, router: Router, env: EnvService) {
    super(http, router, env);
  }

  getHeaders() {
    const auth = `CCToke ${this.KEY}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }
}

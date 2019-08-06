import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { HTTPService } from '../http';
import { ENDPOINTS } from './endpoints';
import { EnvService } from '@campus-cloud/config/env';
import { appStorage } from '@campus-cloud/shared/utils';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Injectable()
export class ApiService extends HTTPService {
  readonly BASE_URL = this.env.apiUrl;

  readonly KEY = environment.keys.readyApiKey;

  readonly VERSION = {
    V1: 'v1'
  };

  readonly ENDPOINTS = ENDPOINTS;

  readonly AUTH_HEADER = {
    TOKEN: 'CCToke',
    SESSION: 'CCSess'
  };

  constructor(http: HttpClient, private router: Router, private env: EnvService) {
    super(http);
  }

  getHeaders() {
    const auth = `CCSess ${appStorage.get(appStorage.keys.SESSION)}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }

  errorHandler(err: HttpErrorResponse) {
    switch (err.status) {
      case 401:
        this.router.navigate(['/logout']);
        return;

      case 404:
      case 403:
      case 500:
      case 503:
        this.router.navigate(['/dashboard']);
        return;

      default:
        return throwError(err);
    }
  }
}

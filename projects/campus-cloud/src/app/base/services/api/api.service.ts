import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HTTPService } from '../http';
import { ENDPOINTS } from './endpoints';
import { EnvService } from '@campus-cloud/config/env';
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

  constructor(http: HttpClient, router: Router, private env: EnvService) {
    super(http, router);
  }
}

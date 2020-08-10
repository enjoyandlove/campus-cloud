import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';
import { Store } from '@ngrx/store';

@Injectable()
export class HealthPassService {
  constructor(private api: ApiService, private store: Store<any>) {}

  getHealthPass(param?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.HEALTH_PASS_SETTING}/`;

    return this.api.get(url, param);
  }

  updateHealthPass(data: any, params?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.HEALTH_PASS_SETTING}/`;

    return this.api.update(url, data, params);
  }
}

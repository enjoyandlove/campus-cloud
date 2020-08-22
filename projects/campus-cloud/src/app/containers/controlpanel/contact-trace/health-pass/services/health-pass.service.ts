import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';

@Injectable()
export class HealthPassService {
  constructor(private api: ApiService) {}

  getHealthPass(school_id?: string) {
    const param: HttpParams = new HttpParams().set('school_id', school_id);

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.HEALTH_PASS_SETTING}/`;

    return this.api.get<IHealthPass[]>(url, param);
  }

  updateHealthPass(data: any, school_id?: string) {
    const param: HttpParams = new HttpParams().set('school_id', school_id);
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.HEALTH_PASS_SETTING}/`;

    return this.api.update(url, data, param);
  }
}

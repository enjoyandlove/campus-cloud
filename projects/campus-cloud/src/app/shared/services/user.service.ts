import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';

/**
 * Student User Service
 * {@link https://gitlab.com/ready-edu-doc/product-tech-doc/-/wikis/Platform-Services/REST-API-Admin/User}
 * */

@Injectable()
export class UserService {
  resource: string;
  constructor(private api: ApiService) {
    this.resource = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}`;
  }

  getAll(params: HttpParams, startRange: number, endRange: number) {
    return this.api.get(`${this.resource}/${startRange};${endRange}`, params, true);
  }

  updateById(studentId: number, body: any) {
    return this.api.update(`${this.resource}/${studentId}`, body, null, true);
  }

  getById(studentId: number) {
    return this.api.get(`${this.resource}/${studentId}`, null, true);
  }
}

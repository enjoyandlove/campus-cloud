import { Http, URLSearchParams } from '@angular/http';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../base/base.service';
import { API } from '../../config/api';

@Injectable()
export class AdminService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AdminService.prototype);
  }

  getAdmins(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getAdminByStoreId(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getAdminById(adminId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.get(url).map((res) => res.json());
  }

  deleteAdminById(adminId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super
      .delete(url, null, true)
      .map((res) => res.json())
      .catch((err) => Observable.throw(err));
  }

  createAdmin(data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/`;

    return super.post(url, data).map((res) => res.json());
  }

  updateAdmin(adminId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.update(url, data, null, true).map((res) => res.json());
  }
}

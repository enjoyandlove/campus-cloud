import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { BaseService } from '../../base/base.service';
import { API } from '../../config/api';

@Injectable()
export class AdminService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AdminService.prototype);
  }

  getAdmins(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getAdminByStoreId(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/`;

    return super.get(url, search);
  }

  getAdminById(adminId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.get(url);
  }

  deleteAdminById(adminId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super
      .delete(url, null, true)

      .catch((err) => observableThrowError(err));
  }

  createAdmin(data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/`;

    return super.post(url, data);
  }

  updateAdmin(adminId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.update(url, data, null, true);
  }
}

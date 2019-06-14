import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError as observableThrowError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sortBy } from 'lodash';

import { API } from '@campus-cloud/config/api';
import { HTTPService } from '@campus-cloud/base/http.service';

export interface IAdmin {
  id: number;
  email: string;
  lastname: string;
  firstname: string;
  is_school_level: boolean;
}

@Injectable()
export class AdminService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AdminService.prototype);
  }

  getAdmins(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getAdminByStoreId(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/1;9000`;

    return super.get(url, search, true).pipe(
      map((admins: IAdmin[]) => {
        if (admins) {
          return sortBy(admins, (admin: IAdmin) => admin.firstname.toLowerCase());
        }
      }),
      catchError(() => of([]))
    );
  }

  getAdminById(adminId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.get(url);
  }

  deleteAdminById(adminId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${adminId}`;

    return super.delete(url, search, true).pipe(catchError((err) => observableThrowError(err)));
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

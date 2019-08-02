import { throwError as observableThrowError, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';

import { ApiService } from '@campus-cloud/base/services';

export interface IAdmin {
  id: number;
  email: string;
  lastname: string;
  firstname: string;
  is_school_level: boolean;
}

@Injectable()
export class AdminService {
  constructor(private api: ApiService) {}

  getAdmins(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  getAdminByStoreId(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/1;9000`;

    return this.api.get(url, search, true).pipe(
      map((admins: IAdmin[]) => {
        if (admins) {
          return sortBy(admins, (admin: IAdmin) => admin.firstname.toLowerCase());
        }
      }),
      catchError(() => of([]))
    );
  }

  getAdminById(adminId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/${adminId}`;

    return this.api.get(url);
  }

  deleteAdminById(adminId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/${adminId}`;

    return this.api.delete(url, search, true).pipe(catchError((err) => observableThrowError(err)));
  }

  createAdmin(data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/`;

    return this.api.post(url, data);
  }

  updateAdmin(adminId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/${adminId}`;

    return this.api.update(url, data, null, true);
  }
}

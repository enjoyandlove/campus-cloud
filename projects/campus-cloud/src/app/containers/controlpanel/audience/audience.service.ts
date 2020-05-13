import { HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { baseActions } from '@campus-cloud/store/base';
import { PersonaPermission } from './audience.status';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class AudienceService {
  constructor(private api: ApiService, private store: Store<any>) {}

  getUsers(search: HttpParams): Observable<any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER}/`;

    return this.api.get(url, search);
  }

  getAudiences(search: HttpParams, startRange: number, endRange: number): Observable<any> {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true).pipe(catchError(() => of([])));
  }

  getAudienceById(audienceId: number, search: HttpParams): Observable<any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/${audienceId}`;

    return this.api.get(url, search);
  }

  deleteAudience(audienceId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/${audienceId}`;

    return this.api.delete(url, search);
  }

  createAudience(body: any, search: HttpParams): Observable<any> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/`;

    return this.api.post(url, body, search);
  }

  updateAudience(audienceId: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}/${audienceId}`;

    return this.api.update(url, body, search);
  }

  getUploadImageUrl() {
    return `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;
  }

  getPersona(search: HttpParams, startRange: number, endRange: number): Observable<any> {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true).pipe(
      map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden)),
      catchError(() => of([]))
    );
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: baseActions.SERVICES_MODAL_SET,
      payload: services
    });
  }
}

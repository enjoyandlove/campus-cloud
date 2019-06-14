import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '@app/config/api';
import { baseActions } from '@app/store/base';
import { HTTPService } from '@app/base/http.service';

@Injectable()
export class ClubsService extends HTTPService {
  constructor(http: HttpClient, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ClubsService.prototype);
  }

  getClubs(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getClubById(serviceId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${serviceId}`;

    return super.get(url, search);
  }

  deleteClubById(serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${serviceId}`;

    return super.delete(url, null, true);
  }

  createClub(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/`;

    return super.post(url, body, search);
  }

  updateClub(body, clubId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${clubId}`;

    return super.update(url, body, search, true);
  }

  setModalClubs(clubs: any[]): void {
    this.store.dispatch({
      type: baseActions.CLUBS_MODAL_SET,
      payload: clubs
    });
  }
}

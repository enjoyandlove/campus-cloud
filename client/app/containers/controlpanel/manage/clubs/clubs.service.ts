import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';
import { CLUBS_MODAL_SET } from '../../../../reducers/clubs.reducer';

@Injectable()
export class ClubsService extends BaseService {

  constructor(http: Http, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ClubsService.prototype);
  }

  getClubs(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getClubById(serviceId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${serviceId}`;

    return super.get(url, { search }).map(res => res.json());
  }

  deleteClubById(serviceId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${serviceId}`;

    return super.delete(url).map(res => res.json());
  }

  createClub(body, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/`;

    return super.post(url, body, { search }).map(res => res.json());
  }

  updateClub(body, clubId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CLUBS}/${clubId}`;

    return super.update(url, body, { search }).map(res => res.json());
  }

  setModalClubs(clubs: any[]): void {
    this.store.dispatch({
      type: CLUBS_MODAL_SET,
      payload: clubs
    });
  }
}

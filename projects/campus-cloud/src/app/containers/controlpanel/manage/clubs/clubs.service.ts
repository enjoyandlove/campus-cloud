import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { baseActions } from '@campus-cloud/store/base';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class ClubsService {
  constructor(private api: ApiService, private store: Store<any>) {}

  getClubs(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getClubById(serviceId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/${serviceId}`;

    return this.api.get(url, search);
  }

  deleteClubById(serviceId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/${serviceId}`;

    return this.api.delete(url, null, true);
  }

  createClub(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/`;

    return this.api.post(url, body, search);
  }

  updateClub(body, clubId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLUBS}/${clubId}`;

    return this.api.update(url, body, search, true);
  }

  setModalClubs(clubs: any[]): void {
    this.store.dispatch({
      type: baseActions.CLUBS_MODAL_SET,
      payload: clubs
    });
  }
}

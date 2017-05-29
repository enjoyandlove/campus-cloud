import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';
import { CLUBS_MODAL_SET } from '../../../../reducers/clubs.reducer';

const mockClubs = require('./mock.json');

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

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getClubsbyId(clubId: number) {
    const promise = new Promise(resolve => {
      setTimeout(() => { resolve(mockClubs.filter(club => club.id === +clubId)); }, 1000);
    });

    return Observable.fromPromise(promise).map(res => res[0]);
  }

  setModalClubs(clubs: any[]): void {
    this.store.dispatch({
      type: CLUBS_MODAL_SET,
      payload: clubs
    });
  }
}

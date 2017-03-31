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

  getClubs(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      resolve(mockClubs);
    });

    return Observable.fromPromise(promise).delay(1000).map(res => res);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getClubsbyId(clubId: number) {

    const promise = new Promise(resolve => {
      resolve(mockClubs.filter(club => club.id === clubId));
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  setModalClubs(clubs: any[]): void {
    this.store.dispatch({
      type: CLUBS_MODAL_SET,
      payload: clubs
    });
  }
}

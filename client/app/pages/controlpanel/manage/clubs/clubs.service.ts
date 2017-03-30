import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockClubs = require('./mock.json');

@Injectable()
export class ClubsService extends BaseService {
  constructor(http: Http, router: Router) {
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
}

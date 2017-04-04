import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base/base.service';

const mockMembers = require('./mock.json');

@Injectable()
export class MembersService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, MembersService.prototype);
  }

  getMembers(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      resolve(mockMembers);
    });

    return Observable.fromPromise(promise).delay(1000).map(res => res);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getMembersbyId(clubId: number) {
    const promise = new Promise(resolve => {
      setTimeout(() => { resolve(mockMembers.filter(club => club.id === +clubId)); }, 1000);
    });

    return Observable.fromPromise(promise).map(res => res[0]);
  }

}

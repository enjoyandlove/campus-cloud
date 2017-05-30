import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { BaseService } from '../../../../../base/base.service';

@Injectable()
export class MembersService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, MembersService.prototype);
  }

  getMembers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getSocialGroupDetails(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  removeMember(body: any, memberId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/${memberId}`;

    return super.update(url, body).map(res => res.json());
  }

  addMember(body: any, memberId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/${memberId}`;

    return super.update(url, body).map(res => res.json());
  }

  // getUploadImageUrl() {
  //   return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  // }

  // getMembersbyId(clubId: number) {
  //   const promise = new Promise(resolve => {
  //     setTimeout(() => { resolve(mockMembers.filter(club => club.id === +clubId)); }, 1000);
  //   });

  //   return Observable.fromPromise(promise).map(res => res[0]);
  // }

}

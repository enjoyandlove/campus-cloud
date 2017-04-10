import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockFeeds = require('./feeds.json');
const mockComments = require('./comments.json');

@Injectable()
export class FeedsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, FeedsService.prototype);
  }

  getFeeds(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      setTimeout(() => { resolve(mockFeeds); }, 700);
    });

    return Observable.fromPromise(promise).delay(1000).map(res => res);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getCommentsByFeedId(feedId: number) {

    const promise = new Promise(resolve => {
      resolve(mockComments.filter(comment => comment.school_buzz_id === feedId));
    });

    return Observable.fromPromise(promise).map(res => res);
  }
}

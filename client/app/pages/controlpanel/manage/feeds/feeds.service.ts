import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';

// import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockFeeds = require('./mock.json');

@Injectable()
export class FeedsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, FeedsService.prototype);
  }

  getFeeds(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      resolve(mockFeeds);
    });

    return Observable.fromPromise(promise).map(res => res);
  }
}

/**
 * Base Service
 * Takes care of setting common headers
 * and catching errors
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';

import { API } from '../config/api';
import { CPObj, appStorage } from '../shared/utils';


@Injectable()
export class BaseService {
  constructor(
    private http: Http,
    private router: Router
  ) { }

  get(url: string, opts?: RequestOptionsArgs) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .get(url, { headers, ...opts })
            .delay(200)
            .retry(1)
            .catch(err => this.catchError(err));
  }

  post(url: string, data: any, opts?: RequestOptionsArgs) {
    const headers = API.BUILD_COMMON_HEADERS();

    data = CPObj.cleanNullValues(data);

    return this
            .http
            .post(url, data, { headers, ...opts })
            .delay(200)
            .catch(err => this.catchError(err));
  }

  update(url: string, data: any, opts?: RequestOptionsArgs) {
    const headers = API.BUILD_COMMON_HEADERS();

    data = CPObj.cleanNullValues(data);

    return this
            .http
            .put(url, data, { headers, ...opts })
            .delay(200)
            .retry(1)
            .catch(err => this.catchError(err));
  }

  delete(url: string, opts?: RequestOptionsArgs) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .delete(url, { headers, ...opts })
            .delay(200)
            .retry(1)
            .catch(err => this.catchError(err));
  }

  private catchError(err) {
    switch (err.status) {
      case 401:
        appStorage.clear();
        this.router.navigate(['/login']);
        break;

      case 404:
        this.router.navigate(['../']);
        break;

      case 403:
        this.router.navigate(['../']);
        break;

      case 500:
        this.router.navigate(['/dashboard']);
        break;

      default:
        return Observable.throw(err);
    }
  }
}

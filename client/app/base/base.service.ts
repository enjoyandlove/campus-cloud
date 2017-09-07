/**
 * Base Service
 * Takes care of setting common headers
 * and catching errors
 */
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from './../config/api/index';
import { CPObj, appStorage } from '../shared/utils';

const buildCommonHeaders = () => {
  const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': auth
  });
};

@Injectable()
export class BaseService {
  constructor(
    private http: Http,
    private router: Router
  ) { }

  get(url: string, opts?: RequestOptionsArgs) {
    const headers = buildCommonHeaders();

    return this
      .http
      .get(url, { headers, ...opts })
      .catch(err => {
        if (err.status === 403) {
          return Promise.reject([]);
        }
        return this.catchError(err);
      });
  }

  post(url: string, data: any, opts?: RequestOptionsArgs) {
    const headers = buildCommonHeaders();

    data = CPObj.cleanNullValues(data);

    return this
      .http
      .post(url, data, { headers, ...opts })
      .delay(200)
      .catch(err => this.catchError(err));
  }

  update(url: string, data: any, opts?: RequestOptionsArgs) {
    const headers = buildCommonHeaders();

    data = CPObj.cleanNullValues(data);

    return this
      .http
      .put(url, data, { headers, ...opts })
      .delay(200)
      .retry(1)
      .catch(err => this.catchError(err));
  }

  delete(url: string, opts?: RequestOptionsArgs) {
    const headers = buildCommonHeaders();

    return this
      .http
      .delete(url, { headers, ...opts })
      .catch(err => this.catchError(err));
  }

  catchError(err) {
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
        this.router.navigate(['/welcome']);
        break;

      default:
        return Observable.throw(err);
    }
  }
}

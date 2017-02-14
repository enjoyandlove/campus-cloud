/**
 * Base Service
 * Takes care of setting common headers
 * and catching errors
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { API } from '../config/api';
import { appStorage } from '../shared/utils/localStorage';

@Injectable()
export class BaseService {
  constructor(
    private http: Http,
    private router?: Router
  ) { }

  get(url: string) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .get(url, { headers })
            .retry(3)
            .catch(err => this.catchError(err));
  }

  post(url: string, data: any) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .post(url, data, { headers })
            .retry(3)
            .catch(err => this.catchError(err));
  }

  update(url: string, data: any) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .put(url, data, { headers })
            .retry(3)
            .catch(err => this.catchError(err));
  }

  delete(url: string) {
    const headers = API.BUILD_COMMON_HEADERS();

    return this
            .http
            .delete(url, { headers })
            .retry(3)
            .catch(err => this.catchError(err));
  }

  private catchError(err) {
    // if session key is expired
    if (err.status === 401) {
      appStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
    return Observable.throw(err);
  }
}

import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { appStorage, CPObj } from '../shared/utils';

import { API } from './../config/api/index';
/**
 * Base Service
 * Takes care of setting common headers
 * and catching errors
 */

const buildCommonHeaders = () => {
  const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: auth
  });
};

const emptyResponse = Observable.of(new HttpResponse({ body: JSON.stringify([]) }));

@Injectable()
export abstract class BaseService {
  constructor(private http: HttpClient, private router: Router) {}

  private waitAndRetry(err): Observable<any> {
    let retries = 1;

    return err.delay(1200).flatMap((e) => {
      if (retries > 0) {
        retries -= 1;

        return Observable.of(e);
      }

      return Observable.throw(e);
    });
  }

  clearNullValues(params: HttpParams): HttpParams {
    let cleanParams = new HttpParams();
    params.keys().forEach((key) => {
      if (params.get(key)) {
        cleanParams = cleanParams.set(key, params.get(key));
      }
    });

    return cleanParams;
  }

  get(url: string, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildCommonHeaders();

    return this.http
      .get(url, { headers, params })
      .retryWhen((err) => this.waitAndRetry(err))
      .catch((err) => {
        if (silent) {
          return Observable.throw(err);
        }

        if (err.status === 403) {
          return emptyResponse;
        }

        return this.catchError(err);
      });
  }

  post(url: string, data: any, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildCommonHeaders();

    data = CPObj.cleanNullValues(data);

    return this.http
      .post(url, data, { headers, params })
      .retryWhen((err) => this.waitAndRetry(err))
      .catch((err) => (silent ? Observable.throw(err) : this.catchError(err)));
  }

  update(url: string, data: any, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildCommonHeaders();

    data = CPObj.cleanNullValues(data);

    return this.http
      .put(url, data, { headers, params })
      .retryWhen((err) => this.waitAndRetry(err))
      .catch((err) => (silent ? Observable.throw(err) : this.catchError(err)));
  }

  delete(url: string, params?: HttpParams, silent = false, extraOptions = {}) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildCommonHeaders();

    return this.http
      .delete(url, { headers, params, ...extraOptions })
      .retryWhen((err) => this.waitAndRetry(err))
      .catch((err) => (silent ? Observable.throw(err) : this.catchError(err)));
  }

  catchError(err) {
    switch (err.status) {
      case 401:
        this.router.navigate(['/logout']);

        return emptyResponse;

      case 404:
        this.router.navigate(['/dashboard']);

        return emptyResponse;

      case 403:
        this.router.navigate(['/dashboard']);

        return emptyResponse;

      case 500:
        this.router.navigate(['/dashboard']);

        return emptyResponse;

      default:
        return Observable.throw(err);
    }
  }
}

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { CPObj } from './../../shared/utils/object/object';
import { HTTPService } from '../../base/http.service';
import { API } from '../../config/api';

const buildTokenHeaders = () => {
  const auth = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: auth
  });
};

@Injectable()
export class CallbackService extends HTTPService {
  constructor(public http: HttpClient, public router: Router) {
    super(http, router);
  }

  get(url: string, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildTokenHeaders();

    return this.http.get(url, { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err)),
      catchError((err) => {
        if (silent) {
          return observableThrowError(err);
        }

        if (err.status === 403) {
          return observableOf(new HttpResponse({ body: JSON.stringify([]) }));
        }

        return this.catchError(err);
      })
    );
  }

  post(url: string, data: any, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    data = CPObj.cleanNullValues(data);
    const headers = buildTokenHeaders();

    return this.http
      .post(url, data, { headers, params })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err)),
        catchError((err) => (silent ? observableThrowError(err) : this.catchError(err)))
      );
  }

  update(url: string, data: any, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    data = CPObj.cleanNullValues(data);
    const headers = buildTokenHeaders();

    return this.http
      .put(url, data, { headers, params })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err)),
        catchError((err) => (silent ? observableThrowError(err) : this.catchError(err)))
      );
  }

  delete(url: string, params?: HttpParams, silent = false, extraOptions = {}) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = buildTokenHeaders();

    return this.http
      .delete(url, { headers, params, ...extraOptions })
      .pipe(
        retryWhen((err) => super.waitAndRetry(err)),
        catchError((err) => (silent ? observableThrowError(err) : this.catchError(err)))
      );
  }
}

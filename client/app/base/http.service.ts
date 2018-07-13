import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, delay, flatMap, retryWhen } from 'rxjs/operators';
import { API } from './../config/api/index';
import { appStorage, CPObj } from '../shared/utils';

/**
 * Base HTTP Service
 * extends this class and override
 * getHeaders() if you need a new header
 */

const emptyResponse = observableOf(new HttpResponse({ body: JSON.stringify([]) }));

@Injectable()
export abstract class HTTPService {
  constructor(public http: HttpClient, public router: Router) {}

  waitAndRetry(err: Observable<any>): Observable<any> {
    let retries = 1;

    return err.pipe(
      delay(1200),
      flatMap((e) => {
        if (retries > 0) {
          retries -= 1;

          return observableOf(e).pipe(delay(1200));
        }

        return observableThrowError(e);
      })
    );
  }

  sanitizeEntries(formData) {
    for (const key in formData) {
      if (typeof formData[key] === 'string' || formData[key] instanceof String) {
        formData = {
          ...formData,
          [key]: formData[key].trim()
        };
      }
    }

    return formData;
  }

  getHeaders() {
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }

  clearNullValues(params: HttpParams): HttpParams {
    let cleanParams = new HttpParams();
    params.keys().forEach((key) => {
      if (params.get(key) !== null) {
        cleanParams = cleanParams.set(key, params.get(key));
      }
    });

    return cleanParams;
  }

  get(url: string, params?: HttpParams, silent = false) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = this.getHeaders();

    return this.http.get(url, { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err)),
      catchError((err) => {
        if (silent) {
          return observableThrowError(err);
        }

        if (err.status === 403) {
          return emptyResponse;
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

    const headers = this.getHeaders();

    return this.http
      .post(url, this.sanitizeEntries(data), { headers, params })
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
    const headers = this.getHeaders();

    return this.http
      .put(url, this.sanitizeEntries(data), { headers, params })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err)),
        catchError((err) => (silent ? observableThrowError(err) : this.catchError(err)))
      );
  }

  delete(url: string, params?: HttpParams, silent = false, extraOptions = {}) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = this.getHeaders();

    return this.http
      .delete(url, { headers, params, ...extraOptions })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err)),
        catchError((err) => (silent ? observableThrowError(err) : this.catchError(err)))
      );
  }

  catchError(err) {
    switch (err.status) {
      case 401:
        this.router.navigate(['/logout']);

        return emptyResponse;

      case 404:
      case 403:
      case 500:
      case 503:
        this.router.navigate(['/dashboard']);

        return emptyResponse;

      default:
        return observableThrowError(err);
    }
  }
}

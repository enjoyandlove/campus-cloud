import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, delay, flatMap, retryWhen } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@app/config/api';
import { appStorage, CPObj } from '@shared/utils';

/**
 * Base HTTP Service
 * extends this class and override
 * getHeaders() if you need a new header
 */
const defaultRetries = 1;
const emptyResponse = of(new HttpResponse({ body: JSON.stringify([]) }));

@Injectable()
export abstract class HTTPService {
  constructor(public http: HttpClient, public router: Router) {}

  waitAndRetry(err: Observable<any>, retries: number): Observable<any> {
    return err.pipe(
      delay(1200),
      flatMap((e) => {
        if (retries > 0) {
          retries -= 1;

          return of(e).pipe(delay(1200));
        }

        return throwError(e);
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
      if (params.get(key) !== null && params.get(key) !== undefined) {
        cleanParams = cleanParams.set(key, params.get(key));
      }
    });

    return cleanParams;
  }

  get(url: string, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = this.getHeaders();

    return this.http.get(url, { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => {
        if (silent && err.status !== 401) {
          return throwError(err);
        }

        if (err.status === 403) {
          return emptyResponse;
        }

        return this.catchError(err);
      })
    );
  }

  post(url: string, data: any, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullValues(params);
    }

    data = CPObj.cleanNullValues(data);

    const headers = this.getHeaders();

    return this.http
      .post(url, this.sanitizeEntries(data), { headers, params })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err, retries)),
        catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.catchError(err)))
      );
  }

  update(url: string, data: any, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullValues(params);
    }

    data = CPObj.cleanNullValues(data);
    const headers = this.getHeaders();

    return this.http
      .put(url, this.sanitizeEntries(data), { headers, params })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err, retries)),
        catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.catchError(err)))
      );
  }

  delete(
    url: string,
    params?: HttpParams,
    silent = false,
    extraOptions = {},
    retries = defaultRetries
  ) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = this.getHeaders();

    return this.http
      .delete(url, { headers, params, ...extraOptions })
      .pipe(
        retryWhen((err) => this.waitAndRetry(err, retries)),
        catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.catchError(err)))
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
        return throwError(err);
    }
  }
}

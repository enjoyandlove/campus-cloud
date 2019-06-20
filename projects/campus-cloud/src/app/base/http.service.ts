import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, flatMap, retryWhen } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '@campus-cloud/config/api';
import { appStorage, CPObj, DefaultEncoder } from '@campus-cloud/shared/utils';

/**
 * Base HTTP Service
 * extends this class and override
 * getHeaders() if you need a new header
 */
const defaultRetries = 1;

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
    if (!Array.isArray(formData) && typeof formData !== 'object') {
      return formData;
    }

    return Object.keys(formData).reduce(
      (acc, key) => {
        acc[key.trim()] =
          typeof formData[key] === 'string'
            ? formData[key].trim()
            : this.sanitizeEntries(formData[key]);
        return acc;
      },
      Array.isArray(formData) ? [] : {}
    );
  }

  getHeaders() {
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }

  clearNullValues(params: HttpParams): HttpParams {
    let cleanParams = new HttpParams({ encoder: new DefaultEncoder() });
    params.keys().forEach((key) => {
      if (params.get(key) !== null && params.get(key) !== undefined) {
        cleanParams = cleanParams.set(key, params.get(key));
      }
    });

    return cleanParams;
  }

  get<T>(url: string, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullValues(params);
    }

    const headers = this.getHeaders();

    return this.http.get<T>(url, { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => {
        if (silent && err.status !== 401) {
          return throwError(err);
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

    return this.http.post(url, this.sanitizeEntries(data), { headers, params }).pipe(
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

    return this.http.put(url, this.sanitizeEntries(data), { headers, params }).pipe(
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

    return this.http.delete(url, { headers, params, ...extraOptions }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.catchError(err)))
    );
  }

  catchError(err: HttpErrorResponse) {
    switch (err.status) {
      case 401:
        this.router.navigate(['/logout']);
        return;

      case 404:
      case 403:
      case 500:
      case 503:
        this.router.navigate(['/dashboard']);
        return;

      default:
        return throwError(err);
    }
  }
}

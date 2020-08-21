import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, flatMap, retryWhen } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import { DefaultEncoder, CPObj } from '@campus-cloud/shared/utils';

const defaultRetries = 1;

@Injectable()
export abstract class HTTPService {
  constructor(public http: HttpClient) {}

  abstract getHeaders(): HttpHeaders;

  abstract errorHandler(err: HttpErrorResponse): Observable<boolean> | Promise<boolean>;

  waitAndRetry(err: Observable<any>, retries: number): Observable<any> {
    return err.pipe(
      flatMap((e) => {
        if (retries > 0 && e.status === 503) {
          retries -= 1;

          return of(e).pipe(delay(1200));
        }

        return throwError(e);
      })
    );
  }

  sanitizeEntries(formData) {
    if (formData === null || typeof formData !== 'object') {
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

  clearNullParams(params: HttpParams): HttpParams {
    let cleanParams = new HttpParams({ encoder: new DefaultEncoder() });
    params
      .keys()
      .filter((key) => params.get(key) !== null && params.get(key) !== undefined)
      .forEach((validKey) => (cleanParams = cleanParams.set(validKey, params.get(validKey))));

    return cleanParams;
  }

  get<T>(url: string, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullParams(params);
    }

    const headers = this.getHeaders();

    return this.http.get<T>(url, { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.errorHandler(err)))
    );
  }

  post(url: string, data: any, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullParams(params);
    }

    data = CPObj.cleanNullValues(data);
    const headers = this.getHeaders();

    return this.http.post(url, this.sanitizeEntries(data), { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.errorHandler(err)))
    );
  }

  update(url: string, data: any, params?: HttpParams, silent = false, retries = defaultRetries) {
    if (params) {
      params = this.clearNullParams(params);
    }

    data = CPObj.cleanNullValues(data);

    const headers = this.getHeaders();

    return this.http.put(url, this.sanitizeEntries(data), { headers, params }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.errorHandler(err)))
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
      params = this.clearNullParams(params);
    }

    const headers = this.getHeaders();

    return this.http.delete(url, { headers, params, ...extraOptions }).pipe(
      retryWhen((err) => this.waitAndRetry(err, retries)),
      catchError((err) => (silent && err.status !== 401 ? throwError(err) : this.errorHandler(err)))
    );
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { BaseService } from '../../base/base.service';
import { API } from '../../config/api';
import { CPObj } from '../../shared/utils';

const buildTokenHeaders = () => {
  const auth = `${API.AUTH_HEADER.TOKEN} ${API.KEY}`;

  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: auth
  });
};

@Injectable()
export class CallbackService extends BaseService {
  constructor(public _http: HttpClient, public _router: Router) {
    super(_http, _router);
  }

  get(url: string, params?: HttpParams, silent = false) {
    const headers = buildTokenHeaders();

    return this._http
      .get(url, { headers, params })
      .pipe(
        delay(200),
        retry(1),
        catchError((err) => (silent ? observableThrowError(err) : super.catchError(err)))
      );
  }

  post(url: string, data: any, params?: HttpParams): Observable<any> {
    const headers = buildTokenHeaders();

    data = CPObj.cleanNullValues(data);

    return this._http
      .post(url, data, { headers, params })
      .pipe(delay(200), catchError((err) => this.catchError(err)));
  }

  update(url: string, data: any, params?: HttpParams) {
    const headers = buildTokenHeaders();

    data = CPObj.cleanNullValues(data);

    return this._http
      .put(url, data, { headers, params })
      .pipe(delay(200), retry(1), catchError((err) => this.catchError(err)));
  }

  delete(url: string, params?: HttpParams) {
    const headers = buildTokenHeaders();

    return this._http
      .delete(url, { headers, params })
      .pipe(delay(200), retry(1), catchError((err) => this.catchError(err)));
  }
}

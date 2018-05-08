import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../config/api';

import { BaseService } from '../../base/base.service';
import { CPObj } from '../../shared/utils';
import { Observable } from 'rxjs/Observable';

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

  get(url: string, opts?: HttpParams, silent = false) {
    const headers = buildTokenHeaders();

    return this._http
      .get(url, { headers, ...opts })
      .delay(200)
      .retry(1)
      .catch((err) => (silent ? Observable.throw(err) : super.catchError(err)));
  }

  post(url: string, data: any, opts?: HttpParams) {
    const headers = buildTokenHeaders();

    data = CPObj.cleanNullValues(data);

    return this._http
      .post(url, data, { headers, ...opts })
      .delay(200)
      .catch((err) => this.catchError(err));
  }

  update(url: string, data: any, opts?: HttpParams) {
    const headers = buildTokenHeaders();

    data = CPObj.cleanNullValues(data);

    return this._http
      .put(url, data, { headers, ...opts })
      .delay(200)
      .retry(1)
      .catch((err) => this.catchError(err));
  }

  delete(url: string, opts?: HttpParams) {
    const headers = buildTokenHeaders();

    return this._http
      .delete(url, { headers, ...opts })
      .delay(200)
      .retry(1)
      .catch((err) => this.catchError(err));
  }
}

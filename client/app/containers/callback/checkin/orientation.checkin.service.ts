import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

// import { API } from '../../../config/api';
import { Observable } from 'rxjs/Observable';
import { CheckinService } from './checkin.service';

@Injectable()
export class OrientationCheckinService extends CheckinService {
  dummy;
  mock = require('./orientation-events/mockCheckin.json');

  constructor(public _http: Http, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: URLSearchParams, silent) {
    this.dummy = search;
    this.dummy = silent;

    return Observable.of(this.mock);
  }

  doEventCheckin(data: any, search: URLSearchParams) {
    this.dummy = search;
    this.dummy = data;

    return Observable.of([]);
  }
}

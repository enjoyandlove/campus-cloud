import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

// import { API } from '../../../config/api';
import { Observable } from 'rxjs/Observable';
import { FeedbackService } from './feedback.service';

@Injectable()
export class OrientationFeedbackService extends FeedbackService {
  dummy;

  constructor(public _http: Http, public _router: Router) {
    super(_http, _router);
  }

  getEventData(search: URLSearchParams) {
    this.dummy = search;

    return Observable.of([]);
  }

  doEventFeedback(data: any, search: URLSearchParams) {
    this.dummy = search;
    this.dummy = data;

    return Observable.of([]);
  }
}

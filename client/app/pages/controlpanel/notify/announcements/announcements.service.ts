import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';
import { SERVICES_MODAL_SET } from '../../../../reducers/services-modal.reducer';

const mockAnnouncements = require('./mock.json');

@Injectable()
export class AnnouncementsService extends BaseService {
  constructor(
    http: Http,
    router: Router,
    private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, AnnouncementsService.prototype);
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getAnnouncements(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getAnnouncementById(messageId) {
    const promise = new Promise(resolve => {
      resolve(mockAnnouncements.filter(list => {
        if (list.id === +messageId) {
          return list;
        }
      }));
    });

    return Observable.fromPromise(promise).map(res => res[0]);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  setModalServices(services: any[]): void {
    console.log(services);
    this.store.dispatch({
      type: SERVICES_MODAL_SET,
      payload: services
    });
  }
}

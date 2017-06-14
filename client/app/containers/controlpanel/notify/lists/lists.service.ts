import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';
import { SERVICES_MODAL_SET } from '../../../../reducers/services-modal.reducer';

const mockLists = require('./mock.json');

@Injectable()
export class ListsService extends BaseService {
  constructor(
    http: Http,
    router: Router,
    private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ListsService.prototype);
  }

  getLists(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      setTimeout(() => { resolve(mockLists); }, 700);
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  getMessageById(messageId) {
    const promise = new Promise(resolve => {
      resolve(mockLists.filter(list => {
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

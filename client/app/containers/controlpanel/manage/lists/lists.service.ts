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
  constructor(http: Http, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, ListsService.prototype);
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getLists(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  removeList(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${id}`;

    return super.delete(url, { search }).map((res) => res);
  }

  createList(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  updateList(listId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${listId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  getMessageById(messageId) {
    const promise = new Promise((resolve) => {
      resolve(
        mockLists.filter((list) => {
          if (list.id === +messageId) {
            return list;
          }
        })
      );
    });

    return Observable.fromPromise(promise).map((res) => res[0]);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: SERVICES_MODAL_SET,
      payload: services
    });
  }
}

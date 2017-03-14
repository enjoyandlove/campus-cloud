import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockLinks = require('./mock.json');

@Injectable()
export class LinksService extends BaseService {
  constructor(http: Http) {
    super(http);

    Object.setPrototypeOf(this, LinksService.prototype);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}`;
  }

  createLink() {
    return 'creating link';
  }

  getLinks(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      resolve(mockLinks);
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  getLinkById(serviceId) {
    const promise = new Promise(resolve => {
      resolve(mockLinks.filter(service => {
        if (service.id === +serviceId) {
          return service;
        }
      }));
    });

    return Observable.fromPromise(promise).map(res => res[0]);
  }

  getEvents(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}${startRage};${endRage}`;
    return super.get(url, { search }).map(res => res.json());
  }

  getEventById(id: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}${id}`;

    return super.get(url).map(res => res.json());
  }

  getEventsByHostId(hostId: string) {
    const search = new URLSearchParams();
    search.append('store_id', hostId);

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getEventAttendanceByEventId(search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}`;

    return super.get(url, { search }).map(res => res.json());
  }
}

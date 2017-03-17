import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

// const mockLinks = require('./mock.json');

@Injectable()
export class LinksService extends BaseService {
  constructor(http: Http) {
    super(http);

    Object.setPrototypeOf(this, LinksService.prototype);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getLinks(startRage: number, endRage: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${startRage};${endRage}`;
    return super.get(url).map(res => res.json());
  }

  getLinkById(linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.get(url).map(res => res.json());
  }

  updateLink(body, linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.update(url, body).map(res => res.json());
  }

  createLink(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body).map(res => res.json());
  }

  deleteLink(linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.delete(url).map(res => res.json());
  }

  // getLinks(search?: URLSearchParams) {
  //   if (search) { console.log(search); }

  //   const promise = new Promise(resolve => {
  //     resolve(mockLinks);
  //   });

  //   return Observable.fromPromise(promise).map(res => res);
  // }

  // getLinkById(serviceId) {
  //   const promise = new Promise(resolve => {
  //     resolve(mockLinks.filter(service => {
  //       if (service.id === +serviceId) {
  //         return service;
  //       }
  //     }));
  //   });

  //   return Observable.fromPromise(promise).map(res => res[0]);
  // }
}

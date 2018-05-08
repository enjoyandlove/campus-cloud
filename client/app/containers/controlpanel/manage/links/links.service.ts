import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class LinksService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, LinksService.prototype);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getLinks(startRage: number, endRage: number, search?: HttpParams) {
    search.append('is_system', '0');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getLinkById(linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.get(url);
  }

  updateLink(body, linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.update(url, body);
  }

  createLink(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body);
  }

  deleteLink(linkId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.delete(url);
  }
}

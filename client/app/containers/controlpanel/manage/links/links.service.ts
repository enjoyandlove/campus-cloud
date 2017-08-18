import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class LinksService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, LinksService.prototype);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getLinks(startRage: number, endRage: number, search?: URLSearchParams) {
    search.append('is_system', '0');

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${startRage};${endRage}`;
    return super.get(url, { search }).map(res => res.json());
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
}

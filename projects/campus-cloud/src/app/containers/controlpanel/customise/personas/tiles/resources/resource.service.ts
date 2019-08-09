import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class ResourceService {
  constructor(private api: ApiService) {}

  getCampusLinkById(linkId, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/${linkId}`;

    return this.api.get(url, search, true);
  }

  getCampusLink(search: HttpParams, startRange, endRange) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  createCampusLink(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/`;

    return this.api.post(url, body, null, true);
  }

  updateCampusLink(linkId, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/${linkId}`;

    return this.api.update(url, body, null, true);
  }
}

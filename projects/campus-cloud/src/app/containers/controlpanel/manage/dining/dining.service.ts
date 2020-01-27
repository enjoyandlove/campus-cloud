import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { protocolCheck } from '@campus-cloud/shared/utils';

@Injectable()
export class DiningService {
  constructor(private api: ApiService) {}

  getDining(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getDiningById(diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    return this.api.get(url, search, true);
  }

  createDining(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/`;

    body = this.validateLinkUrls(body);

    return this.api.post(url, body, search, true);
  }

  updateDining(body, diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    body = this.validateLinkUrls(body);

    return this.api.update(url, body, search, true);
  }

  deleteDiningById(diningId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${diningId}`;

    return this.api.delete(url, search);
  }

  private validateLinkUrls(body) {
    const { links } = body;

    if (!links || !Array.isArray(links)) {
      return body;
    }

    return {
      ...body,
      links: links.map((l: { label: string; url: string }) => {
        const { url } = l;
        if (url.length) {
          return {
            ...l,
            url: protocolCheck(url)
          };
        }
        return l;
      })
    };
  }
}

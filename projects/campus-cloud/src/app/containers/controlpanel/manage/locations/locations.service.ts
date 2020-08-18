import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { protocolCheck } from '@campus-cloud/shared/utils';
import { Store } from '@ngrx/store';
import { baseActions } from '@campus-cloud/store';

@Injectable()
export class LocationsService {
  constructor(private api: ApiService, private store: Store<any>) {}

  getLocations(startRange: number, endRange: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getLocationById(locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

    return this.api.get(url, search);
  }

  updateLocation(body, locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

    body = this.validateLinkUrls(body);

    return this.api.update(url, body, search);
  }

  createLocation(body, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/`;

    body = this.validateLinkUrls(body);

    return this.api.post(url, body, search);
  }

  deleteLocationById(locationId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LOCATIONS}/${locationId}`;

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

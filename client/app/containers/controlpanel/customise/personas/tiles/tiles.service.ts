import { startWith, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { HTTPService } from '../../../../../base/http.service';

@Injectable()
export class TilesService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TilesService.prototype);
  }

  getTileById(tileId, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return super.get(url, search);
  }

  updateTile(linkId, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/${linkId}`;

    return super.update(url, body);
  }

  getSchoolLinks(headers) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/1;2000`;

    return super.get(url, headers, true).pipe(
      startWith([{ label: '---', action: null }]),
      map((links) => {
        return links.map((link: any) => {
          return {
            action: link.id,
            label: link.name
          };
        });
      })
    );
  }

  getServiceCategories(headers) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES_CATEGORY}/1;2000`;

    return super.get(url, headers, true).pipe(
      startWith([{ label: '---' }]),
      map((categories) => {
        return categories.map((category: any) => {
          return {
            action: category.id,
            label: category.name
          };
        });
      })
    );
  }

  getSchoolServices(search) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/1;2000`;

    return super.get(url, search, true).pipe(
      startWith([{ label: '---' }]),
      map((services) => {
        return services.map((service: any, index) => {
          if (index === 0) {
            return {
              label: '---',
              value: null
            };
          }

          return {
            value: service.id,
            label: service.name
          };
        });
      })
    );
  }

  getSchoolCalendars(headers) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDAR}/1;2000`;

    return super.get(url, headers, true).pipe(
      startWith([{ label: '---' }]),
      map((calendars) => {
        return calendars.map((calendar: any, index) => {
          if (index === 0) {
            return {
              label: '---',
              value: null
            };
          }

          return {
            value: calendar.id,
            label: calendar.name
          };
        });
      })
    );
  }

  deleteTile(tileId, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return super.delete(url, search);
  }

  createCampusTile(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/`;

    return super.post(url, body, null, true);
  }

  createCampusLink(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body, null, true);
  }

  updateCampusTile(tileId, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return super.update(url, body, null, true);
  }

  updateCampusLink(linkId, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/${linkId}`;

    return super.update(url, body, null, true);
  }
}

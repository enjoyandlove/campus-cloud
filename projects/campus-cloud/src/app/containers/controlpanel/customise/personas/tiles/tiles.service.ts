import { HttpParams } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';
import { CPI18nService } from '@campus-cloud/shared/services';

@Injectable()
export class TilesService {
  constructor(private api: ApiService, private cpI18n: CPI18nService) {}

  getTileById(tileId, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return this.api.get(url, search);
  }

  updateTile(linkId, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/${linkId}`;

    return this.api.update(url, body);
  }

  getSchoolLinks(headers) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/1;2000`;

    return this.api.get(url, headers, true).pipe(
      startWith([{ label: '---', action: null }]),
      map((links: any[]) => {
        return links.map((link: any) => {
          return {
            action: link.id,
            label: link.name
          };
        });
      })
    );
  }

  uploadBase64Image(body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;

    return this.api.post(url, body);
  }

  getServiceCategories(headers) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES_CATEGORY}/1;2000`;

    return this.api.get(url, headers, true).pipe(
      startWith([{ label: '---' }]),
      map((categories: any[]) => {
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
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}`;
    const url = `${common}/1;2000`;

    return this.api.get(url, search, true).pipe(
      map((services: any[]) => {
        return [
          { label: this.cpI18n.translate('t_shared_select_service'), action: null, heading: true },
          ...services
            .filter((s: any) => s.id)
            .map((service: any) => {
              return {
                action: service.id,
                label: service.name
              };
            })
        ];
      }),
      startWith([{ label: '---' }])
    );
  }

  getSchoolCalendars(headers) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR}/1;2000`;

    return this.api.get(url, headers, true).pipe(
      map((calendars: any[]) => {
        return [
          { label: this.cpI18n.translate('t_shared_select_calendar'), action: null, heading: true },
          ...calendars
            .filter((c: any) => c.id)
            .map((calendar: any) => {
              return {
                action: calendar.id,
                label: calendar.name
              };
            })
        ];
      }),
      startWith([{ label: '---' }])
    );
  }

  deleteTile(tileId, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return this.api.delete(url, search);
  }

  createCampusTile(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/`;

    return this.api.post(url, body, null, true);
  }

  createCampusLink(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/`;

    return this.api.post(url, body, null, true);
  }

  updateCampusTile(tileId, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return this.api.update(url, body, null, true);
  }

  bulkUpdateTiles(search: HttpParams, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/`;

    return this.api.update(url, body, search, true);
  }

  updateCampusLink(linkId, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/${linkId}`;

    return this.api.update(url, body, null, true);
  }
}

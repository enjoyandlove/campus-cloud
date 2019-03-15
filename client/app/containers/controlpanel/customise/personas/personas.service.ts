import { HttpClient, HttpParams } from '@angular/common/http';
import { map, startWith, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sortBy } from 'lodash';

import { API } from '@app/config/api';
import { HTTPService } from '@app/base/http.service';
import { ICampusGuide } from './sections/section.interface';

@Injectable()
export class PersonasService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, PersonasService.prototype);
  }

  getCampusLinks(search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}`;
    const url = `${common}/1;3000`;

    return super.get(url, search);
  }

  getPersonas(startRange: number, endRange: number, search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search, true);
  }

  getServices(search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/1;3000`;

    return super.get(url, search, true).pipe(
      map((services: any[]) => {
        return [
          { label: '---', value: null },
          ...services.map((service: any) => {
            return {
              label: service.name,
              action: service.id,
              meta: {
                ...service
              }
            };
          })
        ];
      }),
      startWith([{ label: '---' }]),
      catchError(() => [])
    );
  }

  createCampusLink(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body);
  }

  createGuideTile(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/`;

    return super.post(url, body);
  }

  updateSectionTileCategory(tileCategoryId: number, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.GUIDE_TILE_CATEGORY
    }/${tileCategoryId}`;

    return super.update(url, body, null, true);
  }

  createPersona(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/`;

    return super.post(url, body);
  }

  getPersonaById(personaId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.get(url, search, true);
  }

  deletePersonaById(personaId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.delete(url, search, true);
  }

  deleteTileById(tileId, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return super.delete(url, search, true);
  }

  updatePersona(personaId: number, search: HttpParams, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.update(url, body, search, true);
  }

  getTilesByPersona(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/1;90000`;

    return super.get(url, search).pipe(map((res) => sortBy(res, (t: any) => t.rank)));
  }

  getTilesCategories(search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILE_CATEGORY}`;
    const url = `${common}/1;90000`;

    return super.get(url, search).pipe(
      map((categories: ICampusGuide[]) => {
        categories = categories.filter((c) => c.id !== 0);

        return sortBy(categories, (t: any) => t.rank);
      })
    );
  }
}

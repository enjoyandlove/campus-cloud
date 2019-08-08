import { map, startWith, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';

import { ITile } from './tiles/tile.interface';
import { ApiService } from '@campus-cloud/base/services';
import { ICampusGuide } from './sections/section.interface';

@Injectable()
export class PersonasService {
  constructor(private api: ApiService) {}

  getCampusLinks(search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}`;
    const url = `${common}/1;3000`;

    return this.api.get(url, search);
  }

  getPersonas(startRange: number, endRange: number, search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search, true);
  }

  getServices(search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICES}`;
    const url = `${common}/1;3000`;

    return this.api.get(url, search, true).pipe(
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
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.LINKS}/`;

    return this.api.post(url, body);
  }

  createGuideTile(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/`;

    return this.api.post(url, body);
  }

  updateSectionTileCategory(tileCategoryId: number, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILE_CATEGORY}/${tileCategoryId}`;

    return this.api.update(url, body, null, true);
  }

  createPersona(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/`;

    return this.api.post(url, body);
  }

  getPersonaById(personaId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/${personaId}`;

    return this.api.get(url, search, true);
  }

  deletePersonaById(personaId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/${personaId}`;

    return this.api.delete(url, search, true);
  }

  deleteTileById(tileId, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/${tileId}`;

    return this.api.delete(url, search, true);
  }

  updatePersona(personaId: number, search: HttpParams, body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/${personaId}`;

    return this.api.update(url, body, search, true);
  }

  getTilesByPersona(search: HttpParams): Observable<ITile[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILES}/1;90000`;

    return this.api.get(url, search).pipe(map((res: ITile[]) => sortBy(res, (t: any) => t.rank)));
  }

  getTilesCategories(search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILE_CATEGORY}`;
    const url = `${common}/1;90000`;

    return this.api.get(url, search).pipe(
      map((categories: ICampusGuide[]) => {
        categories = categories.filter((c) => c.id !== 0);

        return sortBy(categories, (t: any) => t.rank);
      })
    );
  }
}

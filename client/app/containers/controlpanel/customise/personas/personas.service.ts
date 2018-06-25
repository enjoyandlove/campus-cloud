import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sortBy } from 'lodash';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base/http.service';

@Injectable()
export class PersonasService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, PersonasService.prototype);
  }

  getPersonas(startRange: number, endRange: number, search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
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

    return super.get(url, search);
  }

  deletePersonaById(personaId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.delete(url, search, true);
  }

  updatePersona(personaId: number, search: HttpParams, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.update(url, body, search);
  }

  getTilesByPersona(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILES}/`;

    return super.get(url, search).pipe(map((res) => sortBy(res, (t: any) => t.rank)));
  }

  getTilesCategories(search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILE_CATEGORY}`;
    const url = `${common}/1;90000`;

    return super.get(url, search).pipe(map((res) => sortBy(res, (t: any) => t.rank)));
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class PersonasService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, PersonasService.prototype);
  }

  getPersonas(startRange: number, endRange: number, search: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createPersona(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/`;

    return super.post(url, body).map((res) => res.json());
  }

  getPersonaById(personaId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  deletePersonaById(personaId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.delete(url, { search }, true).map((res) => res.json());
  }

  updatePersona(personaId: number, search: URLSearchParams, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}/${personaId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }
}

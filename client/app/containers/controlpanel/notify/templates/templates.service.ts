import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base/http.service';

@Injectable()
export class TemplatesService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TemplatesService.prototype);
  }

  postTemplate(search: HttpParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, search);
  }

  createTemplate(search: HttpParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.TEMPLATE}/`;

    return super.post(url, body, search);
  }

  getTemplateById(search: HttpParams, templateId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.TEMPLATE}/${templateId}`;

    return super.get(url, search);
  }

  deleteTemplate(search: HttpParams, templateId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.TEMPLATE}/${templateId}`;

    return super.delete(url, search);
  }

  getTemplates(startRange: number, endRange: number, search: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.TEMPLATE}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }
}

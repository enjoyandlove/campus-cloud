import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class TemplatesService {
  constructor(private api: ApiService) {}

  postTemplate(search: HttpParams, body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/`;

    return this.api.post(url, body, search);
  }

  createTemplate(search: HttpParams, body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.TEMPLATE}/`;

    return this.api.post(url, body, search);
  }

  getTemplateById(search: HttpParams, templateId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.TEMPLATE}/${templateId}`;

    return this.api.get(url, search);
  }

  deleteTemplate(search: HttpParams, templateId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.TEMPLATE}/${templateId}`;

    return this.api.delete(url, search);
  }

  getTemplates(startRange: number, endRange: number, search: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.TEMPLATE}`;

    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }
}

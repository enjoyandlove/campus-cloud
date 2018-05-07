import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class TemplatesService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, TemplatesService.prototype);
  }

  postTemplate(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ANNOUNCEMENT
    }/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  createTemplate(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.TEMPLATE}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  getTemplateById(search: URLSearchParams, templateId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.TEMPLATE
    }/${templateId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  deleteTemplate(search: URLSearchParams, templateId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.TEMPLATE
    }/${templateId}`;

    return super.delete(url, { search }).map((res) => res);
  }

  getTemplates(startRange: number, endRange: number, search: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.TEMPLATE
    }`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }
}

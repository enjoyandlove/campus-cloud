import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class CustomizationService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, CustomizationService.prototype);
  }

  getCoverImage(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.COVER_PHOTO
    }/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  uploadBase64Image(body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;

    return super.post(url, body).map((res) => res.json());
  }

  updateSchoolImage(imageUrl: string, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.COVER_PHOTO
    }/`;

    return super
      .update(url, { cover_photo_url: imageUrl }, { search })
      .map((res) => res.json());
  }
}

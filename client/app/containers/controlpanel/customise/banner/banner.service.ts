import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class BannerService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, BannerService.prototype);
  }

  getCoverImage(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.COVER_PHOTO}/`;

    return super.get(url, search);
  }

  uploadBase64Image(body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;

    return super.post(url, body);
  }

  updateSchoolImage(imageUrl: string, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.COVER_PHOTO}/`;

    return super.update(url, { cover_photo_url: imageUrl }, search);
  }
}

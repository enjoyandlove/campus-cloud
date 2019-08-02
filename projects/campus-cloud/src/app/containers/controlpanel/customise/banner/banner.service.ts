import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class BannerService {
  constructor(private api: ApiService) {}

  getCoverImage(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.COVER_PHOTO}/`;

    return this.api.get(url, search);
  }

  uploadBase64Image(body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;

    return this.api.post(url, body);
  }

  updateSchoolImage(imageUrl: string, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.COVER_PHOTO}/`;

    return this.api.update(url, { cover_photo_url: imageUrl }, search);
  }
}

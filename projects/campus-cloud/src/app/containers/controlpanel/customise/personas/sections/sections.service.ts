import { ICampusGuide } from './section.interface';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class SectionsService {
  _guide;

  set guide(guide: ICampusGuide) {
    this._guide = guide;
  }

  get guide(): ICampusGuide {
    return this._guide;
  }

  constructor(private api: ApiService) {}

  deleteSectionTileCategory(tileCategoryId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILE_CATEGORY}/${tileCategoryId}`;

    return this.api.delete(url, search, true);
  }

  createSectionTileCategory(body) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GUIDE_TILE_CATEGORY}/`;

    return this.api.post(url, body, null, true);
  }
}

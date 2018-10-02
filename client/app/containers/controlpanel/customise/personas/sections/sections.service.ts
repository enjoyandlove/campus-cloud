import { ICampusGuide } from './section.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { HTTPService } from '../../../../../base/http.service';

@Injectable()
export class SectionsService extends HTTPService {
  _guide;

  set guide(guide: ICampusGuide) {
    this._guide = guide;
  }

  get guide(): ICampusGuide {
    return this._guide;
  }

  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, SectionsService.prototype);
  }

  deleteSectionTileCategory(tileCategoryId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.GUIDE_TILE_CATEGORY
    }/${tileCategoryId}`;

    return super.delete(url, search, true);
  }

  createSectionTileCategory(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GUIDE_TILE_CATEGORY}/`;

    return super.post(url, body, null, true);
  }
}

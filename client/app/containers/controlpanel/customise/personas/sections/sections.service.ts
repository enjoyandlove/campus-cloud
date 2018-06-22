import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { HTTPService } from '../../../../../base/http.service';

@Injectable()
export class SectionsService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, SectionsService.prototype);
  }

  updateSectionTileCategory(tileCategoryId: number, body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.GUIDE_TILE_CATEGORY
    }/${tileCategoryId}`;

    return super.update(url, body, null, true);
  }
}

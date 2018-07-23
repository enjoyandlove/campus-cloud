import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../../config/api';
import { HTTPService } from '../../../../../../base/http.service';

@Injectable()
export class ResourceService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, ResourceService.prototype);
  }

  createCampusLink(body) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.LINKS}/`;

    return super.post(url, body, null, true);
  }
}

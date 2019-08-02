import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class CallbackService {
  constructor(public api: ApiService) {}

  getHeaders() {
    const auth = `${this.api.AUTH_HEADER.TOKEN} ${this.api.KEY}`;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: auth
    });
  }
}

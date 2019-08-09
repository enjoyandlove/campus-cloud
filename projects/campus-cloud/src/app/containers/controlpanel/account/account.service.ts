import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class AccountService {
  constructor(private api: ApiService) {}

  resetPassword(body: any, userid: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ADMIN}/${userid}`;

    return this.api.update(url, body);
  }
}

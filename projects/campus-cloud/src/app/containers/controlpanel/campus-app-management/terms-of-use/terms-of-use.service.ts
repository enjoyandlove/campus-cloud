import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';

@Injectable({
  providedIn: 'root'
})
export class TermsOfUseService {
  constructor(private api: ApiService, private session: CPSession) {}

  getTerms() {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLIENT_CONFIG}/`;

    return this.api.get(url, this.getParams(), true);
  }

  postTerms(body, termId) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CLIENT_CONFIG}/${termId}`;

    return this.api.update(url, body, null, true);
  }

  private getParams() {
    return new HttpParams().set('client_id', this.session.g.get('school').client_id);
  }
}

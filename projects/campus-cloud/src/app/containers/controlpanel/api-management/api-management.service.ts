import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { mockAPIData } from './tests';

@Injectable()
export class ApiManagementService {
  dummy;

  constructor() {}

  getTokens(startRange: number, endRange: number, search?: HttpParams) {
    this.dummy = [startRange, endRange, search];

    return of(mockAPIData);
  }

  postToken(body) {
    this.dummy = [body];

    return of({
      name: 'Computer room',
      date_created: 1564588800,
      date_last_modified: 1564588800,
      id: 'hj263749hgd76651hjd768wk',
      token: 'live_qB23EwdDrFtdfG4G5Re0LlsaqWe34R5g'
    });
  }

  deleteToken(tokenId: string) {
    this.dummy = [tokenId];

    return of([]);
  }
}

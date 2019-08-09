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
}

import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromDining from '../store';

@Injectable()
export class CanDeactivateDining implements CanDeactivate<any> {
  constructor(
    private store: Store<fromDining.IDiningState>
  ) {}

  canDeactivate() {
    this.store.dispatch(new fromDining.Destroy());

    return true;
  }
}

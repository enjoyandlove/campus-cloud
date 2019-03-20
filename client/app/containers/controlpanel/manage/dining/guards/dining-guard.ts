import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromDining from '../store';
import * as fromCategories from '../categories/store';

@Injectable()
export class CanDeactivateDining implements CanDeactivate<any> {
  constructor(private store: Store<fromDining.IDiningState | fromCategories.ICategoriesState>) {}

  canDeactivate() {
    this.store.dispatch(new fromDining.Destroy());
    this.store.dispatch(new fromCategories.Destroy());

    return true;
  }
}

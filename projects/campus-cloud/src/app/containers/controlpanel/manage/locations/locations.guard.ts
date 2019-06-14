import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromLocations from './store';
import * as fromCategories from './categories/store';

@Injectable()
export class CanDeactivateLocations implements CanDeactivate<any> {
  constructor(
    private store: Store<fromLocations.ILocationsState | fromCategories.ICategoriesState>
  ) {}

  canDeactivate() {
    this.store.dispatch(new fromLocations.Destroy());
    this.store.dispatch(new fromCategories.Destroy());

    return true;
  }
}

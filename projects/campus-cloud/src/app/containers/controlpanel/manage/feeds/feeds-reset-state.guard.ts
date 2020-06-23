import {
  UrlTree,
  CanDeactivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '@controlpanel/manage/feeds/store';

@Injectable({
  providedIn: 'root'
})
export class FeedsResetStateGuard implements CanDeactivate<unknown> {
  constructor(private store: Store<fromStore.IWallsState>) {}
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { url } = nextState;

    if (!url.startsWith('/manage/feeds')) {
      this.store.dispatch(fromStore.resetState());
    }
    return true;
  }
}

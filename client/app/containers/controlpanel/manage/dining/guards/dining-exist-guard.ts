import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';

@Injectable()
export class DiningExistGuard implements CanActivate {
  diningId: number;

  constructor(private store: Store<fromStore.IDiningState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.diningId = parseInt(route.params.diningId, 10);
    return this.checkStore().pipe(
      switchMap(() => this.hasDining(this.diningId))
    );
  }

  hasDining(id: number): Observable<boolean> {
    return this.store.select(fromStore.getDiningEntities)
      .pipe(
        map((dining) => !!dining[id]),
        take(1)
      );
  }

  checkStore() {
    return this.store.select(fromStore.getDiningEntities)
      .pipe(
        tap((dining) => {
          const diningId = this.diningId;

          const hasSchedule = Object.keys(dining).length
            ? Boolean(dining[this.diningId].schedule.length) : false;

          if (!hasSchedule) {
            this.store.dispatch(new fromStore.GetDiningById({ diningId }));
          }
        }),
        filter((dining) => !!dining[this.diningId]),
        take(1)
      );
  }
}

import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LocationExistsGuard implements CanActivate {
  locationId: number;

  constructor(
    private session: CPSession,
    private store: Store<fromStore.ILocationsState>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.locationId = parseInt(route.params.locationId, 10);
    return this.checkStore().pipe(
      switchMap(() => {
        return this.hasLocation(this.locationId);
      })
    );
  }

  hasLocation(id: number): Observable<boolean> {
    return this.store.select(fromStore.getLocationsById)
      .pipe(
        map((location: any) => !!location[id]),
        take(1)
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getLocationsById)
      .pipe(
        tap((locations: any) => {
          const locationId = this.locationId;

          const hasSchedule = Object.keys(locations).length
            ? Boolean(locations[this.locationId].schedule.length) : false;

          if (!hasSchedule) {
            const search = new HttpParams()
              .append('school_id', this.session.g.get('school').id);

            const payload = {
              locationId,
              params: search
            };

            this.store.dispatch(new fromStore.GetLocationById(payload));
          }
        }),
        filter((location) => !!location[this.locationId]),
        take(1)
      );
  }
}

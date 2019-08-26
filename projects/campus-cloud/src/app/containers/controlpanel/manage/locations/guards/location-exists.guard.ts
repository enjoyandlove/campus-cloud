import { tap, take, filter, switchMap, catchError } from 'rxjs/operators';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';

@Injectable()
export class LocationExistsGuard implements CanActivate {
  constructor(private session: CPSession, private store: Store<fromStore.ILocationsState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getFromStoreOrApi(+route.params.locationId).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  getFromStoreOrApi(locationId: number): Observable<boolean> {
    return this.store.select(fromStore.getLocationsById(locationId)).pipe(
      tap((location: any) => {
        // legacy locations do not return a schedule key
        const schedule = _get(location, 'schedule', []);

        if (!schedule.length) {
          const payload = {
            locationId
          };
          this.store.dispatch(new fromStore.GetLocationById(payload));
        }
      }),
      filter((location) => !!location),
      take(1)
    );
  }
}

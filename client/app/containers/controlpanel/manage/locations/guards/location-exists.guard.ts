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
  constructor(
    private session: CPSession,
    private store: Store<fromStore.ILocationsState>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap((_) => {
        const id = parseInt(route.params.locationId, 10);

        return this.hasLocation(id);
      })
    );
  }

  hasLocation(id: number): Observable<boolean> {
    return this.store.select(fromStore.getLocations)
      .pipe(
        map((locations: any) => !!locations.find((location) => location.id === id)),
        take(1)
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getLocationsLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            const search = new HttpParams()
              .append('school_id', this.session.g.get('school').id);

            const payload = {
              startRange: 1,
              endRange: 100,
              params: search
            };

            this.store.dispatch(new fromStore.GetLocations(payload));
          }
        }),
        filter((loaded) => loaded),
        take(1)
      );
  }
}

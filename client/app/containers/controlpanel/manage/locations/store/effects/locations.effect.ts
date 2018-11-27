import { map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { ILocation } from '../../locations.interface';
import { LocationsService } from '../../locations.service';

@Injectable()
export class LocationsEffect {
  constructor(public actions$: Actions, public service: LocationsService) {}

  @Effect()
  getLocations$: Observable<fromActions.GetLocationsSuccess | fromActions.GetLocationsFail>
    = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_LOCATIONS),
    mergeMap((action: fromActions.GetLocations) => {
      const { startRange, endRange, params } = action.payload;

      return this.service.getLocations(startRange, endRange, params )
        .pipe(
          map((data: ILocation[]) => new fromActions.GetLocationsSuccess(data)),
          catchError((error) => of(new fromActions.GetLocationsFail(error)))
        );
    })
  );
}

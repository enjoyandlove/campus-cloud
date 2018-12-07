import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { ILocation } from '../../locations.interface';
import { LocationsService } from '../../locations.service';

@Injectable()
export class LocationsEffect {
  constructor(
    public router: Router,
    public actions$: Actions,
    public service: LocationsService
  ) {}

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

  @Effect()
  createLocation$: Observable<fromActions.PostLocationSuccess | fromActions.PostLocationFail>
    = this.actions$.pipe(
    ofType(fromActions.locationActions.POST_LOCATION),
    mergeMap((action: fromActions.PostLocation) => {
      const { body, params } = action.payload;

      return this.service
        .createLocation(body, params)
        .pipe(
          map((data: ILocation[]) => new fromActions.PostLocationSuccess(data)),
          tap((_) => {
            this.router.navigate(['/manage/locations']);
          }),
          catchError((error) => of(new fromActions.PostLocationFail(error)))
        );
    })
  );

  @Effect()
  editLocation$: Observable<fromActions.EditLocationSuccess | fromActions.EditLocationFail>
    = this.actions$.pipe(
    ofType(fromActions.locationActions.EDIT_LOCATION),
    mergeMap((action: fromActions.EditLocation) => {
      const { locationId, body, params } = action.payload;

      return this.service
        .updateLocation(body, locationId, params)
        .pipe(
          map((data: ILocation) => new fromActions.EditLocationSuccess(data)),
          tap((_) => {
            this.router.navigate(['/manage/locations']);
          }),
          catchError((error) => of(new fromActions.EditLocationFail(error)))
        );
    })
  );

  @Effect()
  deleteLocation$: Observable<fromActions.DeleteLocationSuccess | fromActions.DeleteLocationFail>
    = this.actions$.pipe(
    ofType(fromActions.locationActions.DELETE_LOCATION),
    mergeMap((action: fromActions.DeleteLocation) => {
      const { locationId, params } = action.payload;

      return this.service
        .deleteLocationById(locationId, params)
        .pipe(
          map(() => new fromActions.DeleteLocationSuccess({ deletedId: locationId })),
          catchError((error) => of(new fromActions.DeleteLocationFail(error)))
        );
    })
  );
}

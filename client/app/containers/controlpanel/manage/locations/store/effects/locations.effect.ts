import { map, tap, mergeMap, catchError, filter, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromActions from '../actions';
import { ILocation } from '@libs/locations/common/model';
import { LocationsService } from '../../locations.service';
import * as fromCategoryStore from '../../categories/store';
import { ICategory } from '@libs/locations/common/categories/model';

@Injectable()
export class LocationsEffect {
  constructor(
    public router: Router,
    public actions$: Actions,
    public service: LocationsService,
    public store: Store<fromCategoryStore.ICategoriesState>
  ) {}

  @Effect()
  getLocations$: Observable<
    fromActions.GetLocationsSuccess | fromActions.GetLocationsFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_LOCATIONS),
    mergeMap((action: fromActions.GetLocations) => {
      const { startRange, endRange, params } = action.payload;

      return this.service
        .getLocations(startRange, endRange, params)
        .pipe(
          map((data: ILocation[]) => new fromActions.GetLocationsSuccess(data)),
          catchError((error) => of(new fromActions.GetLocationsFail(error)))
        );
    })
  );

  @Effect()
  getFilteredLocations$: Observable<
    fromActions.GetFilteredLocationsSuccess | fromActions.GetFilteredLocationsFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_FILTERED_LOCATIONS),
    mergeMap((action: fromActions.GetFilteredLocations) => {
      const { startRange, endRange, params } = action.payload;

      return this.service
        .getLocations(startRange, endRange, params)
        .pipe(
          map((data: ILocation[]) => new fromActions.GetFilteredLocationsSuccess(data)),
          catchError((error) => of(new fromActions.GetFilteredLocationsFail(error)))
        );
    })
  );

  @Effect()
  getLocationById$: Observable<
    fromActions.GetLocationByIdSuccess | fromActions.GetLocationByIdFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_LOCATION_BY_ID),
    mergeMap((action: fromActions.GetLocationById) => {
      const { locationId, params } = action.payload;

      return this.service
        .getLocationById(locationId, params)
        .pipe(
          map((data: ILocation) => new fromActions.GetLocationByIdSuccess(data)),
          catchError((error) => of(new fromActions.GetLocationByIdFail(error)))
        );
    })
  );

  @Effect()
  createLocation$: Observable<
    fromActions.PostLocationSuccess | fromActions.PostLocationFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.POST_LOCATION),
    mergeMap((action: fromActions.PostLocation) => {
      const { body, params } = action.payload;

      return this.service
        .createLocation(body, params)
        .pipe(
          map((data: ILocation) => new fromActions.PostLocationSuccess(data)),
          tap((data) => this.router.navigate([`/manage/locations/${data.payload.id}/info`])),
          catchError((error) => of(new fromActions.PostLocationFail(error)))
        );
    })
  );

  @Effect()
  createLocationSuccess$: Observable<fromCategoryStore.GetCategoriesSuccess> = this.actions$.pipe(
    ofType(fromActions.locationActions.POST_LOCATION_SUCCESS),
    map((action: fromActions.PostLocationSuccess) => action.payload),
    withLatestFrom(this.store.select(fromCategoryStore.getCategories)),
    map(([{ category_id }, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === category_id) {
          category = {
            ...category,
            locations_count: category.locations_count + 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromCategoryStore.GetCategoriesSuccess(c)))
  );

  @Effect()
  editLocation$: Observable<
    fromActions.EditLocationSuccess | fromActions.EditLocationFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.EDIT_LOCATION),
    mergeMap((action: fromActions.EditLocation) => {
      const { locationId, categoryId, body, params } = action.payload;

      return this.service
        .updateLocation(body, locationId, params)
        .pipe(
          map((data: ILocation) => new fromActions.EditLocationSuccess({ data: data, categoryId })),
          tap((_) => this.router.navigate([`/manage/locations/${locationId}/info`])),
          catchError((error) => of(new fromActions.EditLocationFail(error)))
        );
    })
  );

  @Effect()
  editLocationSuccess$: Observable<fromCategoryStore.GetCategoriesSuccess> = this.actions$.pipe(
    ofType(fromActions.locationActions.EDIT_LOCATION_SUCCESS),
    map((action: fromActions.GetLocationByIdSuccess) => action.payload),
    withLatestFrom(this.store.select(fromCategoryStore.getCategories)),
    map(([locations, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === locations['categoryId']) {
          category = {
            ...category,
            locations_count: category.locations_count - 1
          };
        }

        if (category.id === locations['data'].category_id) {
          category = {
            ...category,
            locations_count: category.locations_count + 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromCategoryStore.GetCategoriesSuccess(c)))
  );

  @Effect()
  deleteLocation$: Observable<
    fromActions.DeleteLocationSuccess | fromActions.DeleteLocationFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.DELETE_LOCATION),
    mergeMap((action: fromActions.DeleteLocation) => {
      const { locationId, categoryId, params } = action.payload;

      return this.service
        .deleteLocationById(locationId, params)
        .pipe(
          map(() => new fromActions.DeleteLocationSuccess({ deletedId: locationId, categoryId })),
          catchError((error) => of(new fromActions.DeleteLocationFail(error)))
        );
    })
  );

  @Effect()
  deleteLocationSuccess$: Observable<fromCategoryStore.GetCategoriesSuccess> = this.actions$.pipe(
    ofType(fromActions.locationActions.DELETE_LOCATION_SUCCESS),
    map((action: fromActions.DeleteLocationSuccess) => action.payload),
    withLatestFrom(this.store.select(fromCategoryStore.getCategories)),
    map(([{ categoryId }, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === categoryId) {
          category = {
            ...category,
            locations_count: category.locations_count - 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromCategoryStore.GetCategoriesSuccess(c)))
  );
}

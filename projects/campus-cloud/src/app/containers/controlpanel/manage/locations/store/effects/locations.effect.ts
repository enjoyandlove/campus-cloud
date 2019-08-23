import { map, tap, mergeMap, catchError, filter, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromActions from '../actions';
import { CPSession } from '@campus-cloud/session';
import { LocationsService } from '../../locations.service';
import * as fromCategoryStore from '../../categories/store';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { ILocation } from '@campus-cloud/libs/locations/common/model';
import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';
import { LocationsUtilsService, LocationType } from '@campus-cloud/libs/locations/common/utils';

@Injectable()
export class LocationsEffect {
  constructor(
    private router: Router,
    private actions$: Actions,
    private session: CPSession,
    private service: LocationsService,
    private utils: LocationsUtilsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromCategoryStore.ICategoriesState>
  ) {}

  @Effect()
  getLocations$: Observable<
    fromActions.GetLocationsSuccess | fromActions.GetLocationsFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_LOCATIONS),
    mergeMap((action: fromActions.GetLocations) => {
      const { startRange, endRange, state } = action.payload;
      const params = this.defaultParams(state);

      return this.service.getLocations(startRange, endRange, params).pipe(
        map((data: ILocation[]) => new fromActions.GetLocationsSuccess(data)),
        catchError((error) => of(new fromActions.GetLocationsFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  getFilteredLocations$: Observable<
    fromActions.GetFilteredLocationsSuccess | fromActions.GetFilteredLocationsFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_FILTERED_LOCATIONS),
    mergeMap((action: fromActions.GetFilteredLocations) => {
      const { startRange, endRange, state } = action.payload;
      const params = this.defaultParams(state);

      return this.service.getLocations(startRange, endRange, params).pipe(
        map((data: ILocation[]) => new fromActions.GetFilteredLocationsSuccess(data)),
        catchError((error) =>
          of(new fromActions.GetFilteredLocationsFail(parseErrorResponse(error)))
        )
      );
    })
  );

  @Effect()
  getLocationById$: Observable<
    fromActions.GetLocationByIdSuccess | fromActions.GetLocationByIdFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.GET_LOCATION_BY_ID),
    mergeMap((action: fromActions.GetLocationById) => {
      const { locationId } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.getLocationById(locationId, params).pipe(
        map((data: ILocation) => new fromActions.GetLocationByIdSuccess(data)),
        catchError((error) => of(new fromActions.GetLocationByIdFail(parseErrorResponse(error))))
      );
    })
  );

  @Effect()
  createLocation$: Observable<
    fromActions.PostLocationSuccess | fromActions.PostLocationFail
  > = this.actions$.pipe(
    ofType(fromActions.locationActions.POST_LOCATION),
    mergeMap((action: fromActions.PostLocation) => {
      const { body } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.createLocation(body, params).pipe(
        map((data: ILocation) => {
          const eventName = amplitudeEvents.MANAGE_CREATED_LOCATION;
          const properties = {
            ...this.utils.parsedEventProperties(data),
            location_id: data.id
          };

          this.cpTracking.amplitudeEmitEvent(eventName, properties);
          return new fromActions.PostLocationSuccess(data);
        }),
        tap((data) => this.router.navigate([`/manage/locations/${data.payload.id}/info`])),
        catchError((error) => of(new fromActions.PostLocationFail(parseErrorResponse(error))))
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
      const { updatedCategory, locationId, categoryId, body } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.updateLocation(body, locationId, params).pipe(
        map((data: ILocation) => {
          const eventName = amplitudeEvents.MANAGE_UPDATED_LOCATION;
          const properties = {
            ...this.utils.parsedEventProperties(data),
            location_id: data.id,
            updated_category: updatedCategory
          };

          this.cpTracking.amplitudeEmitEvent(eventName, properties);
          return new fromActions.EditLocationSuccess({ data: data, categoryId });
        }),
        tap(() => this.router.navigate([`/manage/locations/${locationId}/info`])),
        catchError((error) => of(new fromActions.EditLocationFail(parseErrorResponse(error))))
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
      const locationId = action.payload.id;
      const categoryId = action.payload.category_id;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.deleteLocationById(locationId, params).pipe(
        map(() => {
          const deletedItemEventName = amplitudeEvents.DELETED_ITEM;
          const deletedLocationEventName = amplitudeEvents.MANAGE_DELETED_LOCATION;
          const deletedItemEventProperties = this.cpTracking.getEventProperties();
          const deletedLocationEventProperties = {
            ...this.utils.parsedEventProperties(action.payload),
            location_id: action.payload.id
          };

          this.cpTracking.amplitudeEmitEvent(deletedItemEventName, deletedItemEventProperties);
          this.cpTracking.amplitudeEmitEvent(
            deletedLocationEventName,
            deletedLocationEventProperties
          );

          return new fromActions.DeleteLocationSuccess({ deletedId: locationId, categoryId });
        }),
        catchError((error) => of(new fromActions.DeleteLocationFail(parseErrorResponse(error))))
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

  private defaultParams(state): HttpParams {
    return new HttpParams()
      .append('search_str', state.search_str)
      .append('sort_field', state.sort_field)
      .append('category_id', state.category_id)
      .append('location_type', LocationType.location)
      .append('sort_direction', state.sort_direction)
      .append('school_id', this.session.g.get('school').id);
  }
}

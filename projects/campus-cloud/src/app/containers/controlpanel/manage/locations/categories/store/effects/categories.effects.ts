import { map, filter, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromActions from '../actions';
import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store/base';
import { CategoriesService } from '../../categories.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { parseErrorResponse } from '@campus-cloud/shared/utils/http';
import { ILocation } from '@campus-cloud/libs/locations/common/model';
import { LocationType } from '@campus-cloud/libs/locations/common/utils';
import { getLocations } from '@controlpanel/manage/locations/store/selectors';
import { ILocationsState } from '@controlpanel/manage/locations/store/reducers';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { GetLocationsSuccess } from '@controlpanel/manage/locations/store/actions';
import { CategoriesUtilsService } from '@campus-cloud/libs/locations/common/categories/categories.utils.service';
import {
  ICategory,
  LocationCategoryLocale
} from '@campus-cloud/libs/locations/common/categories/model';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: CategoriesService,
    private cpTracking: CPTrackingService,
    private utils: CategoriesUtilsService,
    private store: Store<ILocationsState | ISnackbar>
  ) {}

  @Effect()
  getCategories$: Observable<
    fromActions.GetCategoriesSuccess | fromActions.GetCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES),
    mergeMap(() => {
      const params = this.defaultParams();

      return this.service.getCategories(params).pipe(
        map((data: ICategory[]) => new fromActions.GetCategoriesSuccess(data)),
        catchError((error) => {
          this.handleError();
          return of(new fromActions.GetCategoriesFail(parseErrorResponse(error.error)));
        })
      );
    })
  );

  @Effect()
  getFilteredCategories$: Observable<
    fromActions.GetFilteredCategoriesSuccess | fromActions.GetFilteredCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_FILTERED_CATEGORIES),
    mergeMap((action: fromActions.GetFilteredCategories) => {
      const { state } = action.payload;
      const params = this.defaultParams(state);

      return this.service.getCategories(params).pipe(
        map((data: ICategory[]) => new fromActions.GetFilteredCategoriesSuccess(data)),
        catchError((error) => {
          this.handleError();
          return of(new fromActions.GetFilteredCategoriesFail(parseErrorResponse(error.error)));
        })
      );
    })
  );

  @Effect()
  createCategory$: Observable<
    fromActions.PostCategorySuccess | fromActions.PostCategoryFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.POST_CATEGORY),
    mergeMap((action: fromActions.PostCategory) => {
      const { body } = action.payload;

      return this.service.createCategory(body, this.defaultParams()).pipe(
        map((data: ICategory) => {
          this.handleSuccess('t_category_successfully_created');

          const eventName = amplitudeEvents.MANAGE_CREATED_CATEGORY;
          const eventProperties = {
            ...this.utils.getParsedCategoriesEventProperties(data),
            page_type: amplitudeEvents.LOCATION_CATEGORY
          };

          this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

          return new fromActions.PostCategorySuccess(data);
        }),
        catchError((error) => {
          this.handleError();
          return of(new fromActions.PostCategoryFail(parseErrorResponse(error.error)));
        })
      );
    })
  );

  @Effect()
  editCategories$: Observable<
    fromActions.EditCategorySuccess | fromActions.EditCategoryFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY),
    mergeMap((action: fromActions.EditCategory) => {
      const { categoryId, body } = action.payload;

      return this.service.updateCategory(body, categoryId, this.defaultParams()).pipe(
        map((data: ICategory) => {
          this.handleSuccess('t_category_successfully_edited');

          const eventName = amplitudeEvents.MANAGE_UPDATED_CATEGORY;
          const eventProperties = {
            ...this.utils.getParsedCategoriesEventProperties(data),
            page_type: amplitudeEvents.LOCATION_CATEGORY
          };

          this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

          return new fromActions.EditCategorySuccess(data);
        }),
        catchError((error) => {
          this.handleError();
          return of(new fromActions.EditCategoryFail(parseErrorResponse(error.error)));
        })
      );
    })
  );

  @Effect()
  editCategoriesSuccess$: Observable<GetLocationsSuccess> = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY_SUCCESS),
    map((action: fromActions.EditCategorySuccess) => action.payload),
    withLatestFrom(this.store.select(getLocations)),
    map(([{ id, name, img_url, color }, locations]) => {
      return locations.map((l: ILocation) => {
        if (l.category_id === id) {
          return {
            ...l,
            category_name: name,
            category_color: color,
            category_img_url: img_url
          };
        }
        return l;
      });
    }),
    filter((l: ILocation[]) => coerceBooleanProperty(l.length)),
    mergeMap((l) => of(new GetLocationsSuccess(l)))
  );

  @Effect()
  deleteCategories$: Observable<
    fromActions.DeleteCategoriesSuccess | fromActions.DeleteCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.DELETE_CATEGORIES),
    mergeMap((action: fromActions.DeleteCategories) => {
      const { body } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.deleteCategoryById(body.id, params).pipe(
        map(() => {
          this.handleSuccess('t_category_successfully_deleted');

          const deletedItemEventName = amplitudeEvents.DELETED_ITEM;
          const deletedCategoryEventName = amplitudeEvents.MANAGE_DELETED_CATEGORY;
          const deletedCategoryEventProperties = {
            ...this.utils.getParsedCategoriesEventProperties(body),
            page_type: amplitudeEvents.LOCATION_CATEGORY
          };

          const deletedItemEventProperties = {
            ...this.cpTracking.getEventProperties(),
            page_type: amplitudeEvents.LOCATION_CATEGORY
          };

          this.cpTracking.amplitudeEmitEvent(deletedItemEventName, deletedItemEventProperties);
          this.cpTracking.amplitudeEmitEvent(
            deletedCategoryEventName,
            deletedCategoryEventProperties
          );

          return new fromActions.DeleteCategoriesSuccess({ deletedId: body.id });
        }),
        catchError((error) => {
          this.handleError();
          return of(new fromActions.DeleteCategoriesFail(parseErrorResponse(error.error)));
        })
      );
    })
  );

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  private defaultParams(state?) {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? LocationCategoryLocale.fr
      : LocationCategoryLocale.eng;

    let params = new HttpParams()
      .set('locale', locale)
      .set('location_type', LocationType.location)
      .set('school_id', this.session.g.get('school').id);

    if (state) {
      params = params
        .set('search_str', state.search_str)
        .set('sort_field', state.sort_field)
        .set('sort_direction', state.sort_direction);
    }

    return params;
  }
}

import { map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ICategory } from '../../model';
import * as fromActions from '../actions';
import { ILocation } from '../../../model';
import * as fromLocationStore from '../../../store';
import { parseErrorResponse } from '@shared/utils/http';
import { CategoriesService } from '../../categories.service';

@Injectable()
export class CategoriesEffects {
  constructor(
    public actions$: Actions,
    public service: CategoriesService,
    public store: Store<fromLocationStore.ILocationsState>
  ) {}

  @Effect()
  getCategories$: Observable<fromActions.GetCategoriesSuccess | fromActions.GetCategoriesFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES),
    mergeMap((action: fromActions.GetCategories) => {
      const { params } = action.payload;

      return this.service.getCategories(params)
        .pipe(
          map((data: ICategory[]) => new fromActions.GetCategoriesSuccess(data)),
          catchError((error) => of(new fromActions.GetCategoriesFail(error)))
        );
    })
  );

  @Effect()
  getFilteredCategories$: Observable<fromActions.GetFilteredCategoriesSuccess | fromActions.GetFilteredCategoriesFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_FILTERED_CATEGORIES),
    mergeMap((action: fromActions.GetFilteredCategories) => {
      const { params } = action.payload;

      return this.service.getCategories(params)
        .pipe(
          map((data: ICategory[]) => new fromActions.GetFilteredCategoriesSuccess(data)),
          catchError((error) => of(new fromActions.GetFilteredCategoriesFail(error)))
        );
    })
  );

  @Effect()
  getCategoriesTypes$: Observable<fromActions.GetCategoriesTypeSuccess | fromActions.GetCategoriesTypeFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES_TYPE),
    mergeMap((action: fromActions.GetCategoriesType) => {
      const { params } = action.payload;

      return this.service.getCategoriesType(params)
        .pipe(
          map((data) => new fromActions.GetCategoriesTypeSuccess(data)),
          catchError((error) => of(new fromActions.GetCategoriesTypeFail(error)))
        );
    })
  );

  @Effect()
  createCategory$: Observable<fromActions.PostCategorySuccess | fromActions.PostCategoryFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.POST_CATEGORY),
    mergeMap((action: fromActions.PostCategory) => {
      const { body, params } = action.payload;

      return this.service
        .createCategory(body, params)
        .pipe(
          map((data: ICategory) => new fromActions.PostCategorySuccess(data)),
          catchError((error) => of(new fromActions.PostCategoryFail(error)))
        );
    })
  );

  @Effect()
  editCategories$: Observable<fromActions.EditCategorySuccess | fromActions.EditCategoryFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY),
    mergeMap((action: fromActions.EditCategory) => {
      const { categoryId, body, params } = action.payload;

      return this.service
        .updateCategory(body, categoryId, params)
        .pipe(
          map((data: ICategory) => new fromActions.EditCategorySuccess(data)),
          catchError((error) => of(new fromActions.EditCategoryFail(error)))
        );
    })
  );

  @Effect({dispatch: false})
  editCategoriesSuccess$ = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY_SUCCESS),
    mergeMap((action: fromActions.EditCategorySuccess) => {
      this.updateCategoryInfo(action.payload);

      return of({});
    })
  );

  @Effect()
  deleteCategories$: Observable<fromActions.DeleteCategoriesSuccess | fromActions.DeleteCategoriesFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.DELETE_CATEGORIES),
    mergeMap((action: fromActions.DeleteCategories) => {
      const { categoryId, params } = action.payload;

      return this.service
        .deleteCategoryById(categoryId, params)
        .pipe(
          map(() => new fromActions.DeleteCategoriesSuccess({ deletedId: categoryId })),
          catchError((error) => of(new fromActions.DeleteCategoriesFail(parseErrorResponse(error.error))))
        );
    })
  );

  updateCategoryInfo(data) {
    this.store
      .select(fromLocationStore.getLocations)
      .subscribe((locations: ILocation[]) => {
        locations.filter((location: ILocation) => location.category_id === data.id)
          .map((filteredLocation: ILocation) => {
            filteredLocation['category_name'] = data.name;
            filteredLocation['category_img_url'] = data.img_url;

            return filteredLocation;
          });
      });
  }
}

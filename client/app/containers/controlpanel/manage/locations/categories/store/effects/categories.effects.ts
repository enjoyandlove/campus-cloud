import { map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { ICategory } from '../../model';
import * as fromActions from '../actions';
import { parseErrorResponse } from '@shared/utils/http';
import { CategoriesService } from '../../categories.service';

@Injectable()
export class CategoriesEffects {
  constructor(
    public actions$: Actions,
    public service: CategoriesService
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
  editLocation$: Observable<fromActions.EditCategorySuccess | fromActions.EditCategoryFail>
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
}

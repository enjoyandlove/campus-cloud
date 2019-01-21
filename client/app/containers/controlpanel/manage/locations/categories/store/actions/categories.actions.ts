import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ICategory } from '../../model';

export enum CategoriesActions {
  GET_CATEGORIES = '[manage.events.locations.categories] get categories',
  GET_CATEGORIES_SUCCESS = '[manage.events.locations.categories] get categories success',
  GET_CATEGORIES_FAIL = '[manage.events.locations.categories] get categories fail',

  GET_CATEGORIES_TYPE = '[manage.events.locations.categories] get type categories',
  GET_CATEGORIES_TYPE_SUCCESS = '[manage.events.locations.categories] get categories type success',
  GET_CATEGORIES_TYPE_FAIL = '[manage.events.locations.categories] get categories type fail',

  POST_CATEGORY = '[manage.events.locations.categories] create categories',
  POST_CATEGORY_SUCCESS = '[manage.events.locations.categories] create categories success',
  POST_CATEGORY_FAIL = '[manage.events.locations.categories] create create fail',

  EDIT_CATEGORY = '[manage.events.locations.categories] edit categories',
  EDIT_CATEGORY_SUCCESS = '[manage.events.locations.categories] edit categories success',
  EDIT_CATEGORY_FAIL = '[manage.events.locations.categories] edit create fail',

  DELETE_CATEGORIES = '[manage.events.locations.categories] delete categories',
  DELETE_CATEGORIES_SUCCESS = '[manage.events.locations.categories] delete categories success',
  DELETE_CATEGORIES_FAIL = '[manage.events.locations.categories] delete categories fail',

  RESET_ERROR_MESSAGE = '[manage.locations.categories] reset error message'
}

export class GetCategories implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES;

  constructor(public payload: { params: HttpParams }) {}
}

export class GetCategoriesSuccess implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_SUCCESS;

  constructor(public payload: ICategory[]) {}
}

export class GetCategoriesFail implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetCategoriesType implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_TYPE;

  constructor(public payload: { params: HttpParams }) {}
}

export class GetCategoriesTypeSuccess implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_TYPE_SUCCESS;

  constructor(public payload: any) {}
}

export class GetCategoriesTypeFail implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_TYPE_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class PostCategory implements Action {
  readonly type = CategoriesActions.POST_CATEGORY;
  constructor(public payload: { body: any; params: HttpParams }) {}
}

export class PostCategoryFail implements Action {
  readonly type = CategoriesActions.POST_CATEGORY_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class PostCategorySuccess implements Action {
  readonly type = CategoriesActions.POST_CATEGORY_SUCCESS;
  constructor(public payload: ICategory) {}
}

export class EditCategory implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY;
  constructor(public payload: { categoryId: number; body: ICategory; params: HttpParams }) {}
}

export class EditCategoryFail implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class EditCategorySuccess implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY_SUCCESS;
  constructor(public payload: ICategory) {}
}

export class DeleteCategories implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES;

  constructor(public payload: { categoryId: number, params: HttpParams }) {}
}

export class DeleteCategoriesSuccess implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES_SUCCESS;

  constructor(public payload: { deletedId: number }) {}
}

export class DeleteCategoriesFail implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES_FAIL;

  constructor(public payload: string) {}
}

export class ResetErrorMessage implements Action {
  readonly type = CategoriesActions.RESET_ERROR_MESSAGE;
}

export type Actions =
  | GetCategories
  | GetCategoriesSuccess
  | GetCategoriesFail
  | GetCategoriesType
  | GetCategoriesTypeSuccess
  | GetCategoriesTypeFail
  | PostCategory
  | PostCategoryFail
  | PostCategorySuccess
  | EditCategory
  | EditCategoryFail
  | EditCategorySuccess
  | DeleteCategories
  | DeleteCategoriesSuccess
  | DeleteCategoriesFail
  | ResetErrorMessage;

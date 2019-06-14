import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import {
  ICategory,
  ICategoriesApiQuery
} from '@campus-cloud/libs/locations/common/categories/model';

export enum CategoriesActions {
  GET_CATEGORIES = '[manage.dining.categories] get categories',
  GET_CATEGORIES_SUCCESS = '[manage.dining.categories] get categories success',
  GET_CATEGORIES_FAIL = '[manage.dining.categories] get categories fail',

  GET_FILTERED_CATEGORIES = '[manage.dining.categories] get filtered categories',
  GET_FILTERED_CATEGORIES_SUCCESS = '[manage.dining.categories] get filtered categories success',
  GET_FILTERED_CATEGORIES_FAIL = '[manage.dining.categories] get filtered categories fail',

  POST_CATEGORY = '[manage.dining.categories] create categories',
  POST_CATEGORY_SUCCESS = '[manage.dining.categories] create categories success',
  POST_CATEGORY_FAIL = '[manage.dining.categories] create create fail',

  EDIT_CATEGORY = '[manage.dining.categories] edit categories',
  EDIT_CATEGORY_SUCCESS = '[manage.dining.categories] edit categories success',
  EDIT_CATEGORY_FAIL = '[manage.dining.categories] edit create fail',

  DELETE_CATEGORIES = '[manage.dining.categories] delete categories',
  DELETE_CATEGORIES_SUCCESS = '[manage.dining.categories] delete categories success',
  DELETE_CATEGORIES_FAIL = '[manage.dining.categories] delete categories fail',

  SET_CATEGORIES_API_QUERY = '[manage.dining.categories] set categories api query params',
  DESTROY = '[manage.dining.categories] destroy'
}

export class GetCategories implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES;
}

export class GetCategoriesSuccess implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_SUCCESS;

  constructor(public payload: ICategory[]) {}
}

export class GetCategoriesFail implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetFilteredCategories implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES;
}

export class GetFilteredCategoriesSuccess implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES_SUCCESS;

  constructor(public payload: ICategory[]) {}
}

export class GetFilteredCategoriesFail implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES_FAIL;

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
  constructor(public payload: { categoryId: number; body: ICategory }) {}
}

export class EditCategoryFail implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY_FAIL;
}

export class EditCategorySuccess implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY_SUCCESS;
  constructor(public payload: ICategory) {}
}

export class DeleteCategories implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES;

  constructor(public payload: ICategory) {}
}

export class DeleteCategoriesSuccess implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES_SUCCESS;

  constructor(public payload: { deletedId: number }) {}
}

export class DeleteCategoriesFail implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES_FAIL;
}

export class Destroy implements Action {
  readonly type = CategoriesActions.DESTROY;
}

export class SetCategoriesApiQuery implements Action {
  readonly type = CategoriesActions.SET_CATEGORIES_API_QUERY;

  constructor(public payload: ICategoriesApiQuery) {}
}

export type Actions =
  | GetCategories
  | GetCategoriesSuccess
  | GetCategoriesFail
  | GetFilteredCategories
  | GetFilteredCategoriesFail
  | GetFilteredCategoriesSuccess
  | PostCategory
  | PostCategoryFail
  | PostCategorySuccess
  | EditCategory
  | EditCategoryFail
  | EditCategorySuccess
  | DeleteCategories
  | DeleteCategoriesSuccess
  | DeleteCategoriesFail
  | SetCategoriesApiQuery
  | Destroy;

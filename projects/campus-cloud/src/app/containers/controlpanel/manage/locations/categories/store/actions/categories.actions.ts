import { Action } from '@ngrx/store';

import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';

export enum CategoriesActions {
  GET_CATEGORIES = '[manage.events.locations.categories] get categories',
  GET_CATEGORIES_SUCCESS = '[manage.events.locations.categories] get categories success',
  GET_CATEGORIES_FAIL = '[manage.events.locations.categories] get categories fail',

  GET_FILTERED_CATEGORIES = '[manage.events.locations.categories] get filtered categories',
  GET_FILTERED_CATEGORIES_SUCCESS = '[manage.events.locations.categories] get filtered categories success',
  GET_FILTERED_CATEGORIES_FAIL = '[manage.events.locations.categories] get filtered categories fail',

  POST_CATEGORY = '[manage.events.locations.categories] create categories',
  POST_CATEGORY_SUCCESS = '[manage.events.locations.categories] create categories success',
  POST_CATEGORY_FAIL = '[manage.events.locations.categories] create create fail',

  EDIT_CATEGORY = '[manage.events.locations.categories] edit categories',
  EDIT_CATEGORY_SUCCESS = '[manage.events.locations.categories] edit categories success',
  EDIT_CATEGORY_FAIL = '[manage.events.locations.categories] edit create fail',

  DELETE_CATEGORIES = '[manage.events.locations.categories] delete categories',
  DELETE_CATEGORIES_SUCCESS = '[manage.events.locations.categories] delete categories success',
  DELETE_CATEGORIES_FAIL = '[manage.events.locations.categories] delete categories fail',

  RESET_ERROR_MESSAGE = '[manage.locations.categories] reset error message',

  DESTROY = '[manage.locations.categories] destroy'
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

  constructor(public payload: string) {}
}

export class GetFilteredCategories implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES;

  constructor(public payload: { state }) {}
}

export class GetFilteredCategoriesSuccess implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES_SUCCESS;

  constructor(public payload: ICategory[]) {}
}

export class GetFilteredCategoriesFail implements Action {
  readonly type = CategoriesActions.GET_FILTERED_CATEGORIES_FAIL;

  constructor(public payload: string) {}
}

export class PostCategory implements Action {
  readonly type = CategoriesActions.POST_CATEGORY;
  constructor(public payload: { body: ICategory }) {}
}

export class PostCategoryFail implements Action {
  readonly type = CategoriesActions.POST_CATEGORY_FAIL;
  constructor(public payload: string) {}
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
  constructor(public payload: string) {}
}

export class EditCategorySuccess implements Action {
  readonly type = CategoriesActions.EDIT_CATEGORY_SUCCESS;
  constructor(public payload: ICategory) {}
}

export class DeleteCategories implements Action {
  readonly type = CategoriesActions.DELETE_CATEGORIES;

  constructor(public payload: { body: ICategory }) {}
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

export class Destroy implements Action {
  readonly type = CategoriesActions.DESTROY;
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
  | ResetErrorMessage
  | Destroy;

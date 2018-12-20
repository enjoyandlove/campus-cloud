import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ICategory } from '../../categories.interface';

export enum CategoriesActions {
  GET_CATEGORIES = '[manage.events.locations.categories] get categories',
  GET_CATEGORIES_SUCCESS = '[manage.events.locations.categories] get categories success',
  GET_CATEGORIES_FAIL = '[manage.events.locations.categories] get categories fail',
}

export class GetCategories implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES;

  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetCategoriesSuccess implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_SUCCESS;

  constructor(public payload: ICategory[]) {}
}

export class GetCategoriesFail implements Action {
  readonly type = CategoriesActions.GET_CATEGORIES_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export type Actions =
  | GetCategories
  | GetCategoriesSuccess
  | GetCategoriesFail;

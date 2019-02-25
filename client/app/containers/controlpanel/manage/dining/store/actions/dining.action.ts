import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { IDining } from '@libs/locations/common/model';

export enum diningActions {
  GET_DINING = '[manage.dining] get dining locations',
  GET_DINING_FAIL = '[manage.dining] get dining locations fail',
  GET_DINING_SUCCESS = '[manage.dining] get dining locations success',

  GET_FILTERED_DINING = '[manage.dining] get filtered dining',
  GET_FILTERED_DINING_FAIL = '[manage.dining] get filtered dining fail',
  GET_FILTERED_DINING_SUCCESS = '[manage.dining] get filtered dining success',

  GET_DINING_BY_ID = '[manage.dining] get dining by id',
  GET_DINING_BY_ID_FAIL = '[manage.dining] get dining by id fail',
  GET_DINING_BY_ID_SUCCESS = '[manage.dining] get dining by id success',

  POST_DINING = '[manage.dining] post dining',
  POST_DINING_FAIL = '[manage.dining] post dining fail',
  POST_DINING_SUCCESS = '[manage.dining] post dining success',

  EDIT_DINING = '[manage.dining] edit dining',
  EDIT_DINING_FAIL = '[manage.dining] edit dining fail',
  EDIT_DINING_SUCCESS = '[manage.dining] edit dining success',

  DELETE_DINING = '[manage.dining] delete dining',
  DELETE_DINING_FAIL = '[manage.dining] delete dining fail',
  DELETE_DINING_SUCCESS = '[manage.dining] delete dining success',

  RESET_ERROR = '[manage.dining] reset error to false',

  DESTROY = '[manage.dining] destroy'
}


export class GetDining implements Action {
  readonly type = diningActions.GET_DINING;
  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetDiningFail implements Action {
  readonly type = diningActions.GET_DINING_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetDiningSuccess implements Action {
  readonly type = diningActions.GET_DINING_SUCCESS;
  constructor(public payload: IDining[]) {}
}

export class GetFilteredDining implements Action {
  readonly type = diningActions.GET_FILTERED_DINING;
  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetFilteredDiningFail implements Action {
  readonly type = diningActions.GET_FILTERED_DINING_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetFilteredDiningSuccess implements Action {
  readonly type = diningActions.GET_FILTERED_DINING_SUCCESS;
  constructor(public payload: IDining[]) {}
}

export class GetDiningById implements Action {
  readonly type = diningActions.GET_DINING_BY_ID;
  constructor(public payload: { diningId: number }) {}
}

export class GetDiningByIdFail implements Action {
  readonly type = diningActions.GET_DINING_BY_ID_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetDiningByIdSuccess implements Action {
  readonly type = diningActions.GET_DINING_BY_ID_SUCCESS;
  constructor(public payload: IDining) {}
}

export class PostDining implements Action {
  readonly type = diningActions.POST_DINING;
  constructor(public payload: { body: any; params: HttpParams }) {}
}

export class PostDiningFail implements Action {
  readonly type = diningActions.POST_DINING_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class PostDiningSuccess implements Action {
  readonly type = diningActions.POST_DINING_SUCCESS;
  constructor(public payload: IDining) {}
}

export class EditDining implements Action {
  readonly type = diningActions.EDIT_DINING;
  constructor(public payload: { diningId: number; body: any; params: HttpParams }) {}
}

export class EditDiningFail implements Action {
  readonly type = diningActions.EDIT_DINING_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class EditDiningSuccess implements Action {
  readonly type = diningActions.EDIT_DINING_SUCCESS;
  constructor(public payload: IDining) {}
}

export class DeleteDining implements Action {
  readonly type = diningActions.DELETE_DINING;
  constructor(public payload: { diningId: number; params: HttpParams }) {}
}

export class DeleteDiningFail implements Action {
  readonly type = diningActions.DELETE_DINING_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteDiningSuccess implements Action {
  readonly type = diningActions.DELETE_DINING_SUCCESS;
  constructor(public payload: { deletedId: number }) {}
}

export class ResetError implements Action {
  readonly type = diningActions.RESET_ERROR;
}

export class Destroy implements Action {
  readonly type = diningActions.DESTROY;
}

export type DiningAction =
  | GetDining
  | GetDiningFail
  | GetDiningSuccess
  | GetFilteredDining
  | GetFilteredDiningFail
  | GetFilteredDiningSuccess
  | GetDiningById
  | GetDiningByIdFail
  | GetDiningByIdSuccess
  | PostDining
  | PostDiningFail
  | PostDiningSuccess
  | EditDining
  | EditDiningFail
  | EditDiningSuccess
  | DeleteDining
  | DeleteDiningFail
  | DeleteDiningSuccess
  | ResetError
  | Destroy;

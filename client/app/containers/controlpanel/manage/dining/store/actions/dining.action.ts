import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ILocation } from '@libs/locations/common/model';

export enum diningActions {
  GET_DINING = '[manage.dining] get dining locations',
  GET_DINING_FAIL = '[manage.dining] get dining locations fail',
  GET_DINING_SUCCESS = '[manage.dining] get dining locations success',

  DELETE_DINING = '[manage.dining] delete dining',
  DELETE_DINING_FAIL = '[manage.dining] delete dining fail',
  DELETE_DINING_SUCCESS = '[manage.dining] delete dining success',
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
  constructor(public payload: ILocation[]) {}
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

export type DiningAction =
  | GetDining
  | GetDiningFail
  | GetDiningSuccess
  | DeleteDining
  | DeleteDiningFail
  | DeleteDiningSuccess;

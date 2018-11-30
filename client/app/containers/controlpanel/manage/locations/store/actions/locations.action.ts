import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ILocation } from '../../locations.interface';

export enum locationActions {
  GET_LOCATIONS = '[manage.locations] get locations',
  GET_LOCATIONS_FAIL = '[manage.locations] get locations fail',
  GET_LOCATIONS_SUCCESS = '[manage.locations] get locations success',

  GET_LOCATION_BY_ID = '[manage.locations] get location by id',
  GET_LOCATION_BY_ID_FAIL = '[manage.locations] get location by id fail',
  GET_LOCATION_BY_ID_SUCCESS = '[manage.locations] get location by id success',

  POST_LOCATION = '[manage.locations] post location',
  POST_LOCATION_FAIL = '[manage.locations] post location fail',
  POST_LOCATION_SUCCESS = '[manage.locations] post location success',

  EDIT_LOCATION = '[manage.locations] edit location',
  EDIT_LOCATION_FAIL = '[manage.locations] edit location fail',
  EDIT_LOCATION_SUCCESS = '[manage.locations] edit location success',

  DELETE_LOCATION = '[manage.locations] delete location',
  DELETE_LOCATION_FAIL = '[manage.locations] delete location fail',
  DELETE_LOCATION_SUCCESS = '[manage.locations] delete location success'
}


export class GetLocations implements Action {
  readonly type = locationActions.GET_LOCATIONS;
  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetLocationsFail implements Action {
  readonly type = locationActions.GET_LOCATIONS_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetLocationsSuccess implements Action {
  readonly type = locationActions.GET_LOCATIONS_SUCCESS;
  constructor(public payload: ILocation[]) {}
}

export class GetLocationById implements Action {
  readonly type = locationActions.GET_LOCATION_BY_ID;
  constructor(public payload: { locationId: number; params: HttpParams }) {}
}

export class GetLocationByIdFail implements Action {
  readonly type = locationActions.GET_LOCATION_BY_ID_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class GetLocationByIdSuccess implements Action {
  readonly type = locationActions.GET_LOCATION_BY_ID_SUCCESS;
  constructor(public payload: any) {}
}

export class PostLocation implements Action {
  readonly type = locationActions.POST_LOCATION;
  constructor(public payload: { body: any; params: HttpParams }) {}
}

export class PostLocationFail implements Action {
  readonly type = locationActions.POST_LOCATION_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class PostLocationSuccess implements Action {
  readonly type = locationActions.POST_LOCATION_SUCCESS;
  constructor(public payload: ILocation[]) {}
}

export class EditLocation implements Action {
  readonly type = locationActions.EDIT_LOCATION;
  constructor(public payload: { locationId: number; body: any; params: HttpParams }) {}
}

export class EditLocationFail implements Action {
  readonly type = locationActions.EDIT_LOCATION_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class EditLocationSuccess implements Action {
  readonly type = locationActions.EDIT_LOCATION_SUCCESS;
  constructor(public payload: ILocation[]) {}
}

export class DeleteLocation implements Action {
  readonly type = locationActions.DELETE_LOCATION;
  constructor(public payload: { locationId: number, params: HttpParams }) {}
}

export class DeleteLocationFail implements Action {
  readonly type = locationActions.DELETE_LOCATION_FAIL;
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteLocationSuccess implements Action {
  readonly type = locationActions.DELETE_LOCATION_SUCCESS;
  constructor(public payload: { deletedId: number }) {}
}

export type LocationsAction =
  | GetLocations
  | GetLocationsFail
  | GetLocationsSuccess
  | GetLocationById
  | GetLocationByIdFail
  | GetLocationByIdSuccess
  | PostLocation
  | PostLocationFail
  | PostLocationSuccess
  | EditLocation
  | EditLocationFail
  | EditLocationSuccess
  | DeleteLocation
  | DeleteLocationSuccess
  | DeleteLocationFail;

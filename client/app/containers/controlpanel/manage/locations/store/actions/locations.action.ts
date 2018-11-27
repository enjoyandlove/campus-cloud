import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ILocation } from '../../locations.interface';

export enum locationActions {
  GET_LOCATIONS = '[Manage Locations] Get Locations',
  GET_LOCATIONS_FAIL = '[Manage Locations] Get Locations Fail',
  GET_LOCATIONS_SUCCESS = '[Manage Locations] Get Locations Success'
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

export type LocationsAction = GetLocations | GetLocationsFail | GetLocationsSuccess;

import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { EventIntegration } from './../../model/integration.model';

export enum IntegrationActions {
  GET_INTEGRATIONS = '[manage.events.integrations] get integrations',
  GET_INTEGRATIONS_SUCCESS = '[manage.events.integrations] get integrations success',
  GET_INTEGRATIONS_FAIL = '[manage.events.integrations] get integrations fail',

  POST_INTEGRATION = '[manage.events.integrations] post integration',
  POST_INTEGRATION_SUCCESS = '[manage.events.integrations] post integration success',
  POST_INTEGRATION_FAIL = '[manage.events.integrations] post integration fail',

  DELETE_INTEGRATION = '[manage.events.integrations] delete integration',
  DELETE_INTEGRATION_SUCCESS = '[manage.events.integrations] delete integration success',
  DELETE_INTEGRATION_FAIL = '[manage.events.integrations] delete integration fail',

  EDIT_INTEGRATION = '[manage.events.integrations] edit integration',
  EDIT_INTEGRATION_SUCCESS = '[manage.events.integrations] edit integration success',
  EDIT_INTEGRATION_FAIL = '[manage.events.integrations] edit integration fail',

  GET_HOSTS = '[manage.events.integrations] get hosts',
  GET_HOSTS_SUCCESS = '[manage.events.integrations] get hosts success',
  GET_HOSTS_FAIL = '[manage.events.integrations] get hosts fail'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;

  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: EventIntegration[]) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class PostIntegration implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION;

  constructor(public payload: { body: any; params: HttpParams }) {}
}

export class PostIntegrationSuccess implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_SUCCESS;

  constructor(public payload: EventIntegration) {}
}

export class PostIntegrationFail implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteIntegration implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION;

  constructor(public payload: { integrationId: number; params: HttpParams }) {}
}

export class DeleteIntegrationSuccess implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_SUCCESS;

  constructor(public payload: { deletedId: number }) {}
}

export class DeleteIntegrationFail implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class EditIntegration implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION;

  constructor(public payload: { integrationId: number; body: any; params: HttpParams }) {}
}

export class EditIntegrationSuccess implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_SUCCESS;

  constructor(public payload: EventIntegration) {}
}

export class EditIntegrationFail implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetHosts implements Action {
  readonly type = IntegrationActions.GET_HOSTS;

  constructor(public payload: { params: HttpParams }) {}
}

export class GetHostsSuccess implements Action {
  readonly type = IntegrationActions.GET_HOSTS_SUCCESS;

  constructor(public payload: any[]) {}
}

export class GetHostsFail implements Action {
  readonly type = IntegrationActions.GET_HOSTS_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export type Actions =
  | GetIntegrations
  | GetIntegrationsSuccess
  | GetIntegrationsFail
  | PostIntegration
  | PostIntegrationSuccess
  | PostIntegrationFail
  | DeleteIntegration
  | DeleteIntegrationSuccess
  | DeleteIntegrationFail
  | EditIntegration
  | EditIntegrationSuccess
  | EditIntegrationFail
  | GetHosts
  | GetHostsSuccess
  | GetHostsFail;

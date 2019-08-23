import { Action } from '@ngrx/store';

import { IStore } from '@campus-cloud/shared/services/store.service';
import { IEventIntegration } from '@campus-cloud/libs/integrations/events/model/event-integration.interface';

export enum IntegrationActions {
  DESTROY = '[manage.events.integrations] destroy',

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
  GET_HOSTS_FAIL = '[manage.events.integrations] get hosts fail',

  SYNC_NOW = '[manage.events.integrations] sync now',
  SYNC_NOW_FAIL = '[manage.events.integrations] sync now fail',
  SYNC_NOW_SUCCESS = '[manage.events.integrations] sync now success',

  CREATE_AND_SYNC = '[manage.events.integrations] create and sync',
  UPDATE_AND_SYNC = '[manage.events.integrations] update and sync'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;

  constructor(public payload: { startRange: number; endRange: number }) {}
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: IEventIntegration[]) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;

  constructor(public payload: { error: string }) {}
}

export class PostIntegration implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION;

  constructor(public payload: { body: IEventIntegration; hostType: string }) {}
}

export class PostIntegrationSuccess implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_SUCCESS;

  constructor(public payload: IEventIntegration) {}
}

export class PostIntegrationFail implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_FAIL;

  constructor(public payload: { error: string }) {}
}

export class DeleteIntegration implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION;

  constructor(public payload: { integration: IEventIntegration }) {}
}

export class DeleteIntegrationSuccess implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_SUCCESS;

  constructor(public payload: { deletedId: number }) {}
}

export class DeleteIntegrationFail implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_FAIL;

  constructor(public payload: { error: string }) {}
}

export class EditIntegration implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION;

  constructor(public payload: { integrationId: number; body: IEventIntegration }) {}
}

export class EditIntegrationSuccess implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_SUCCESS;

  constructor(public payload: IEventIntegration) {}
}

export class EditIntegrationFail implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_FAIL;

  constructor(public payload: { error: string }) {}
}

export class GetHosts implements Action {
  readonly type = IntegrationActions.GET_HOSTS;
}

export class GetHostsSuccess implements Action {
  readonly type = IntegrationActions.GET_HOSTS_SUCCESS;

  constructor(public payload: IStore[]) {}
}

export class GetHostsFail implements Action {
  readonly type = IntegrationActions.GET_HOSTS_FAIL;

  constructor(public payload: { error: string }) {}
}

export class SyncNow implements Action {
  readonly type = IntegrationActions.SYNC_NOW;

  constructor(
    public payload: { integration: IEventIntegration; succesMessage?: string; error?: string }
  ) {}
}

export class SyncNowSuccess implements Action {
  readonly type = IntegrationActions.SYNC_NOW_SUCCESS;

  constructor(public payload: { integration: IEventIntegration; message?: string }) {}
}

export class SyncNowFail implements Action {
  readonly type = IntegrationActions.SYNC_NOW_FAIL;

  constructor(public payload: { integration: IEventIntegration; error?: string }) {}
}

export class Destroy implements Action {
  readonly type = IntegrationActions.DESTROY;
}

export class CreateAndSync implements Action {
  readonly type = IntegrationActions.CREATE_AND_SYNC;

  constructor(public payload: { body: IEventIntegration; hostType: string }) {}
}

export class UpdateAndSync implements Action {
  readonly type = IntegrationActions.UPDATE_AND_SYNC;

  constructor(public payload: { integrationId: number; body: IEventIntegration }) {}
}

export type Actions =
  | Destroy
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
  | GetHostsFail
  | CreateAndSync
  | SyncNow
  | SyncNowFail
  | SyncNowSuccess
  | UpdateAndSync;

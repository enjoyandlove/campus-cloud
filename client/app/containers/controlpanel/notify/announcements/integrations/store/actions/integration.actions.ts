import { Action } from '@ngrx/store';

import { IStore } from '@shared/services';
import { IAnnouncementsIntegration } from '../../model';

export enum IntegrationActions {
  GET_INTEGRATIONS = '[manage.notify.announcements] get integrations',
  GET_INTEGRATIONS_SUCCESS = '[manage.notify.announcements] get integrations success',
  GET_INTEGRATIONS_FAIL = '[manage.notify.announcements] get integrations fail',

  DELETE_INTEGRATIONS = '[manage.notify.announcements] delete integrations',
  DELETE_INTEGRATIONS_SUCCESS = '[manage.notify.announcements] delete integrations success',
  DELETE_INTEGRATIONS_FAIL = '[manage.notify.announcements] delete integrations fail',

  GET_SENDERS = '[manage.notify.announcements] get senders',
  GET_SENDERS_SUCCESS = '[manage.notify.announcements] get senders success',
  GET_SENDERS_FAIL = '[manage.notify.announcements] get senders fail',

  CREATE_INTEGRATION = '[manage.notify.announcements] create integration',
  CREATE_INTEGRATION_SUCCESS = '[manage.notify.announcements] create integration success',
  CREATE_INTEGRATION_FAIL = '[manage.notify.announcements] create integration fail'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: { integrations: IAnnouncementsIntegration[] }) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;
}

export class DeleteIntegrations implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATIONS;

  constructor(public payload: { integration: IAnnouncementsIntegration }) {}
}

export class DeleteIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATIONS_SUCCESS;

  constructor(public payload: { integrationId: number }) {}
}

export class DeleteIntegrationsFail implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATIONS_FAIL;
}

export class GetSenders implements Action {
  readonly type = IntegrationActions.GET_SENDERS;
}
export class GetSendersSuccess implements Action {
  readonly type = IntegrationActions.GET_SENDERS_SUCCESS;
  constructor(public payload: IStore[]) {}
}
export class GetSendersFail implements Action {
  readonly type = IntegrationActions.GET_SENDERS_FAIL;
}

export class CreateIntegration implements Action {
  readonly type = IntegrationActions.CREATE_INTEGRATION;
  constructor(public payload: IAnnouncementsIntegration) {}
}
export class CreateIntegrationSuccess implements Action {
  readonly type = IntegrationActions.CREATE_INTEGRATION_SUCCESS;
  constructor(public payload: IAnnouncementsIntegration) {}
}
export class CreateIntegrationFail implements Action {
  readonly type = IntegrationActions.CREATE_INTEGRATION_FAIL;
}

export type Actions =
  | GetIntegrations
  | GetIntegrationsSuccess
  | GetIntegrationsFail
  | DeleteIntegrations
  | DeleteIntegrationsSuccess
  | DeleteIntegrationsFail
  | GetSenders
  | GetSendersSuccess
  | GetSendersFail
  | CreateIntegration
  | CreateIntegrationSuccess
  | CreateIntegrationFail;

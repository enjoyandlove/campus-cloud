import { Action } from '@ngrx/store';
import { IAnnoucementsIntegration } from '../../model';

export enum IntegrationActions {
  GET_INTEGRATIONS = '[manage.notify.announcements] get integrations',
  GET_INTEGRATIONS_SUCCESS = '[manage.notify.announcements] get integrations success',
  GET_INTEGRATIONS_FAIL = '[manage.notify.announcements] get integrations fail'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: { integrations: IAnnoucementsIntegration[] }) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;
}

export type Actions = GetIntegrations | GetIntegrationsSuccess | GetIntegrationsFail;

import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ISocialPostCategory } from '../../../model';
import { IItem } from '@client/app/shared/components';
import { IWallsIntegration } from '@libs/integrations/walls/model';

export enum IntegrationActions {
  GET_INTEGRATIONS = '[manage.walls.integrations] get integrations',
  GET_INTEGRATIONS_SUCCESS = '[manage.walls.integrations] get integrations success',
  GET_INTEGRATIONS_FAIL = '[manage.walls.integrations] get integrations fail',

  GET_SOCIAL_POST_CATEGORIES = '[manage.walls.integrations] get social post categories',
  GET_SOCIAL_POST_CATEGORIES_SUCCESS = '[manage.walls.integrations] get social post categories success',
  GET_SOCIAL_POST_CATEGORIES_FAIL = '[manage.walls.integrations] get social post categories fail',

  POST_SOCIAL_POST_CATEGORIES = '[manage.walls.integrations] post social post categories',
  POST_SOCIAL_POST_CATEGORIES_SUCCESS = '[manage.walls.integrations] post social post categories success',
  POST_SOCIAL_POST_CATEGORIES_FAIL = '[manage.walls.integrations] post social post categories fail',

  DELETE_INTEGRATION = '[manage.walls.integrations] delete integration',
  DELETE_INTEGRATION_SUCCESS = '[manage.walls.integrations] delete integration success',
  DELETE_INTEGRATION_FAIL = '[manage.walls.integrations] delete integration fail',

  POST_INTEGRATION = '[manage.walls.integrations] post integration',
  POST_INTEGRATION_SUCCESS = '[manage.walls.integrations] post integration success',
  POST_INTEGRATION_FAIL = '[manage.walls.integrations] post integration fail',

  EDIT_INTEGRATION = '[manage.walls.integrations] edit integration',
  EDIT_INTEGRATION_SUCCESS = '[manage.walls.integrations] edit integration success',
  EDIT_INTEGRATION_FAIL = '[manage.walls.integrations] edit integration fail',

  RESET_SOCIAL_POST_CATEGORIES = '[manage.walls.integrations] reset social post categories'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;

  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: IWallsIntegration[]) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;

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

export class PostIntegration implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION;

  constructor(public payload: { body: IWallsIntegration; params: HttpParams }) {}
}

export class PostIntegrationSuccess implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_SUCCESS;

  constructor(public payload: IWallsIntegration) {}
}

export class PostIntegrationFail implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class EditIntegration implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION;

  constructor(
    public payload: { integrationId: number; body: IWallsIntegration; params: HttpParams }
  ) {}
}

export class EditIntegrationSuccess implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_SUCCESS;

  constructor(public payload: IWallsIntegration) {}
}

export class EditIntegrationFail implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetSocialPostCategories implements Action {
  readonly type = IntegrationActions.GET_SOCIAL_POST_CATEGORIES;

  constructor(public payload: { params: HttpParams }) {}
}

export class GetSocialPostCategoriesSuccess implements Action {
  readonly type = IntegrationActions.GET_SOCIAL_POST_CATEGORIES_SUCCESS;

  constructor(public payload: IItem[]) {}
}

export class GetSocialPostCategoriesFail implements Action {
  readonly type = IntegrationActions.GET_SOCIAL_POST_CATEGORIES_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class PostSocialPostCategories implements Action {
  readonly type = IntegrationActions.POST_SOCIAL_POST_CATEGORIES;

  constructor(
    public payload: {
      socialPostCategory: {
        params: HttpParams;
        body: ISocialPostCategory;
      };
      integration: {
        body: IWallsIntegration;
        params: HttpParams;
      };
    }
  ) {}
}

export class PostSocialPostCategoriesSuccess implements Action {
  readonly type = IntegrationActions.POST_SOCIAL_POST_CATEGORIES_SUCCESS;

  constructor(public payload: ISocialPostCategory) {}
}

export class PostSocialPostCategoriesFail implements Action {
  readonly type = IntegrationActions.POST_SOCIAL_POST_CATEGORIES_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class ResetSocialPostCategories implements Action {
  readonly type = IntegrationActions.RESET_SOCIAL_POST_CATEGORIES;
}

export type Actions =
  | GetIntegrations
  | GetIntegrationsSuccess
  | GetIntegrationsFail
  | DeleteIntegration
  | DeleteIntegrationFail
  | DeleteIntegrationSuccess
  | PostIntegration
  | PostIntegrationSuccess
  | PostIntegrationFail
  | EditIntegration
  | EditIntegrationSuccess
  | EditIntegrationFail
  | GetSocialPostCategories
  | GetSocialPostCategoriesSuccess
  | GetSocialPostCategoriesFail
  | PostSocialPostCategories
  | PostSocialPostCategoriesSuccess
  | PostSocialPostCategoriesFail
  | ResetSocialPostCategories;

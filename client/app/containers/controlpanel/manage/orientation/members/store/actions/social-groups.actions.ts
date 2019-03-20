import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { ISocialGroup } from './../../../../feeds/model/feeds.interfaces';

export enum SocialGroupTypes {
  GET_SOCIAL_GROUPS = '[manage.orientation.members] get social groups',
  GET_SOCIAL_GROUPS_FAIL = '[manage.orientation.members] get social groups fail',
  GET_SOCIAL_GROUPS_SUCCESS = '[manage.orientation.members] get social groups success'
}

export class GetSocialGroups implements Action {
  readonly type = SocialGroupTypes.GET_SOCIAL_GROUPS;
}

export class GetSocialGroupsFail implements Action {
  readonly type = SocialGroupTypes.GET_SOCIAL_GROUPS_FAIL;

  constructor(public payload: { error: HttpErrorResponse }) {}
}

export class GetSocialGroupsSuccess implements Action {
  readonly type = SocialGroupTypes.GET_SOCIAL_GROUPS_SUCCESS;

  constructor(public payload: { socialGroups: ISocialGroup[] }) {}
}

export type SocialGroupActions = GetSocialGroups | GetSocialGroupsFail | GetSocialGroupsSuccess;

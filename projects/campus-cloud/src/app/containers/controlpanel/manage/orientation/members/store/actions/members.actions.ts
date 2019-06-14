import { Action } from '@ngrx/store';

import { IMember } from '@campus-cloud/libs/members/common/model';
import { PaginatedResult } from '@campus-cloud/shared/utils/http';

export enum MembersType {
  GET_MEMBERS = '[manage.orientation.members] get members',
  GET_MEMBERS_FAIL = '[manage.orientation.members] get members fail',
  GET_MEMBERS_SUCCESS = '[manage.orientation.members] get members success',

  CREATE_MEMBER = '[manage.orientation.members] create member',
  CREATE_MEMBER_SUCCESS = '[manage.orientation.members] create member success',
  CREATE_MEMBER_FAIL = '[manage.orientation.members] create member fail',

  EDIT_MEMBER = '[manage.orientation.members] edit member',
  EDIT_MEMBER_SUCCESS = '[manage.orientation.members] edit member success',
  EDIT_MEMBER_FAIL = '[manage.orientation.members] edit member fail',

  DELETE_MEMBER = '[manage.orientation.members] delete member',
  DELETE_MEMBER_SUCCESS = '[manage.orientation.members] delete member success',
  DELETE_MEMBER_FAIL = '[manage.orientation.members] delete member fail'
}

export class GetMembers implements Action {
  readonly type = MembersType.GET_MEMBERS;

  constructor(public payload: { groupId: number }) {}
}

export class GetMembersFail implements Action {
  readonly type = MembersType.GET_MEMBERS_FAIL;
}

export class GetMembersSuccess implements Action {
  readonly type = MembersType.GET_MEMBERS_SUCCESS;

  constructor(public payload: PaginatedResult<IMember>) {}
}

export class CreateMember implements Action {
  readonly type = MembersType.CREATE_MEMBER;

  constructor(public payload: { member: IMember; memberId: number }) {}
}

export class CreateMemberSuccess implements Action {
  readonly type = MembersType.CREATE_MEMBER_SUCCESS;

  constructor(public payload: IMember) {}
}

export class CreateMemberFail implements Action {
  readonly type = MembersType.CREATE_MEMBER_FAIL;
}

export class EditMember implements Action {
  readonly type = MembersType.EDIT_MEMBER;

  constructor(public payload: { member: IMember; memberId: number }) {}
}

export class EditMemberSuccess implements Action {
  readonly type = MembersType.EDIT_MEMBER_SUCCESS;

  constructor(public payload: IMember) {}
}

export class EditMemberFail implements Action {
  readonly type = MembersType.EDIT_MEMBER_FAIL;
}

export class DeleteMember implements Action {
  readonly type = MembersType.DELETE_MEMBER;

  constructor(
    public payload: { body: { group_id: number; member_type: number }; memberId: number }
  ) {}
}

export class DeleteMemberSuccess implements Action {
  readonly type = MembersType.DELETE_MEMBER_SUCCESS;

  constructor(public payload: IMember) {}
}

export class DeleteMemberFail implements Action {
  readonly type = MembersType.DELETE_MEMBER_FAIL;
}

export type MembersActions =
  | GetMembers
  | GetMembersFail
  | GetMembersSuccess
  | CreateMember
  | CreateMemberSuccess
  | CreateMemberFail
  | EditMember
  | EditMemberSuccess
  | EditMemberFail
  | DeleteMember
  | DeleteMemberSuccess
  | DeleteMemberFail;

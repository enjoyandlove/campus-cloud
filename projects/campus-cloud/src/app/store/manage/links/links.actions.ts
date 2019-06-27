import { Action } from '@ngrx/store';

import { ILinkRange, ILinkSort } from './links.state';
import { ILink } from '../../../containers/controlpanel/manage/links/link.interface';

export enum LinksActionTypes {
  SET_LINKS_SORT = 'manage.links.set links sort',
  SET_LINKS_RANGE = 'manage.links.set links range',
  SET_LINKS_SEARCH = 'manage.links.set links search',
  LOAD_LINKS = 'manage.links.load links',
  LOAD_LINKS_SUCCESS = 'manage.links.load links success',
  LOAD_LINKS_FAILURE = 'manage.links.load links failure',
  CREATE_LINK = 'manage.links.create link',
  CREATE_LINK_SUCCESS = 'manage.links.create link success',
  CREATE_LINK_FAILURE = 'manage.links.create link failure',
  DELETE_LINK = 'manage.links.delete link',
  DELETE_LINK_SUCCESS = 'manage.links.delete link success',
  DELETE_LINK_FAILURE = 'manage.links.delete link failure',
  UPDATE_LINK = 'manage.links.update link',
  UPDATE_LINK_SUCCESS = 'manage.links.update link success',
  UPDATE_LINK_FAILURE = 'manage.links.update link failure'
}

export class SetLinksSort implements Action {
  readonly type = LinksActionTypes.SET_LINKS_SORT;
  constructor(public payload: ILinkSort) {}
}

export class SetLinksRange implements Action {
  readonly type = LinksActionTypes.SET_LINKS_RANGE;
  constructor(public payload: ILinkRange) {}
}

export class SetLinksSearch implements Action {
  readonly type = LinksActionTypes.SET_LINKS_SEARCH;
  constructor(public payload: string) {}
}

export class LoadLinks implements Action {
  readonly type = LinksActionTypes.LOAD_LINKS;
}

export class LoadLinksSuccess implements Action {
  readonly type = LinksActionTypes.LOAD_LINKS_SUCCESS;
  constructor(public payload: ILink[]) {}
}

export class LoadLinksFailure implements Action {
  readonly type = LinksActionTypes.LOAD_LINKS_FAILURE;
  constructor(public payload: any) {}
}

export class CreateLink implements Action {
  readonly type = LinksActionTypes.CREATE_LINK;
  constructor(public payload: ILink) {}
}

export class CreateLinkSuccess implements Action {
  readonly type = LinksActionTypes.CREATE_LINK_SUCCESS;
  constructor(public payload: ILink) {}
}

export class CreateLinkFailure implements Action {
  readonly type = LinksActionTypes.CREATE_LINK_FAILURE;
  constructor(public paylod: any) {}
}

export class DeleteLink implements Action {
  readonly type = LinksActionTypes.DELETE_LINK;
  constructor(public payload: number) {}
}

export class DeleteLinkSuccess implements Action {
  readonly type = LinksActionTypes.DELETE_LINK_SUCCESS;
  constructor(public payload: number) {}
}

export class DeleteLinkFailure implements Action {
  readonly type = LinksActionTypes.DELETE_LINK_FAILURE;
  constructor(public payload: any) {}
}

export class UpdateLink implements Action {
  readonly type = LinksActionTypes.UPDATE_LINK;
  constructor(public payload: { link: ILink; id: number }) {}
}

export class UpdateLinkSuccess implements Action {
  readonly type = LinksActionTypes.UPDATE_LINK_SUCCESS;
  constructor(public payload: ILink) {}
}

export class UpdateLinkFailure implements Action {
  readonly type = LinksActionTypes.UPDATE_LINK_FAILURE;
  constructor(public payload: any) {}
}

export interface LinksActions {
  type: LinksActionTypes;
  payload: any;
}

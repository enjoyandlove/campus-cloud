import { Action } from '@ngrx/store';
import { IStore } from '@campus-cloud/src/app/containers/controlpanel/manage/deals/stores/store.interface';

export const LOAD_STORES = 'manage.deals.load stores';
export const LOAD_STORES_FAIL = 'manage.deals.load stores fail';
export const LOAD_STORES_SUCCESS = 'manage.deals.load stores success';

export const CREATE_STORE = 'manage.deals.create store';
export const CREATE_STORE_FAIL = 'manage.deals.create store fail';
export const CREATE_STORE_SUCCESS = 'manage.deals.create store success';

export const EDIT_STORE = 'manage.deals.edit store';
export const EDIT_STORE_FAIL = 'manage.deals.edit store fail';
export const EDIT_STORE_SUCCESS = 'manage.deals.edit store success';

export const DELETE_STORE = 'manage.deals.delete store';
export const DELETE_STORE_FAIL = 'manage.deals.delete store fail';
export const DELETE_STORE_SUCCESS = 'manage.deals.delete store success';

export class LoadStores implements Action {
  readonly type = LOAD_STORES;
}

export class LoadStoresFail implements Action {
  readonly type = LOAD_STORES_FAIL;
  constructor(public payload: any) {}
}

export class LoadStoresSuccess implements Action {
  readonly type = LOAD_STORES_SUCCESS;
  constructor(public payload: any) {}
}

export class CreateStore implements Action {
  readonly type = CREATE_STORE;
  constructor(public payload: IStore) {}
}

export class CreateStoreFail implements Action {
  readonly type = CREATE_STORE_FAIL;
  constructor(public payload: any) {}
}

export class CreateStoreSuccess implements Action {
  readonly type = CREATE_STORE_SUCCESS;
  constructor(public payload: any) {}
}

export class EditStore implements Action {
  readonly type = EDIT_STORE;
  constructor(public payload: IStore) {}
}

export class EditStoreFail implements Action {
  readonly type = EDIT_STORE_FAIL;
  constructor(public payload: any) {}
}

export class EditStoreSuccess implements Action {
  readonly type = EDIT_STORE_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteStore implements Action {
  readonly type = DELETE_STORE;
  constructor(public payload: number) {}
}

export class DeleteStoreFail implements Action {
  readonly type = DELETE_STORE_FAIL;
  constructor(public payload: any) {}
}

export class DeleteStoreSuccess implements Action {
  readonly type = DELETE_STORE_SUCCESS;
  constructor(public payload: any) {}
}

export type DealsAction =
  | LoadStores
  | LoadStoresFail
  | LoadStoresSuccess
  | CreateStore
  | CreateStoreFail
  | CreateStoreSuccess
  | EditStore
  | EditStoreFail
  | EditStoreSuccess
  | DeleteStore
  | DeleteStoreFail
  | DeleteStoreSuccess;

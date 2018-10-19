import { Action } from '@ngrx/store';

export const LOAD_STORES = 'manage.deals.load stores';
export const LOAD_STORES_FAIL = 'manage.deals.load stores fail';
export const LOAD_STORES_SUCCESS = 'manage.deals.load stores success';

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

export type DealsAction = LoadStores | LoadStoresFail | LoadStoresSuccess;

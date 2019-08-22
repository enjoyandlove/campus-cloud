import { Action } from '@ngrx/store';

import { ISnackbar } from '../base.state';

export const SNACKBAR_SHOW = 'SNACKBAR_SHOW';
export const SNACKBAR_HIDE = 'SNACKBAR_HIDE';
export const SNACKBAR_SUCCESS = 'SNACKBAR_SUCCESS';
export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';

const initialState: ISnackbar = {
  body: null,
  sticky: false,
  class: 'success',
  autoClose: false,
  autoCloseDelay: 4000
};

const actionClass = {
  [SNACKBAR_ERROR]: 'danger',
  default: 'success'
};

export class SnackbarSuccess implements Action {
  readonly type = SNACKBAR_SUCCESS;
  constructor(public payload: any) {}
}

export class SnackbarError implements Action {
  readonly type = SNACKBAR_ERROR;
  constructor(public payload: any) {}
}

export function reducer(state = initialState, action): ISnackbar {
  switch (action.type) {
    case SNACKBAR_SHOW:
      return { ...state, ...action.payload };
    case SNACKBAR_HIDE:
      return initialState;
    case SNACKBAR_SUCCESS:
    case SNACKBAR_ERROR:
      const body = action.payload.body;
      const sticky = action.payload.sticky || true;
      const autoClose = action.payload.autoClose || true;
      const autoCloseDelay = action.payload.autoCloseDelay || 4000;
      return {
        ...state,
        body,
        sticky,
        autoClose,
        autoCloseDelay,
        class: actionClass[action.type] || actionClass.default
      };
    default:
      return state;
  }
}

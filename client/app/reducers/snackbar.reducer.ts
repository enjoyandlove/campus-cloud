import { Action } from '@ngrx/store';

export const SNACKBAR_SHOW = 'SNACKBAR_SHOW';
export const SNACKBAR_HIDE = 'SNACKBAR_HIDE';

export interface ISnackbar {
  body: string;
  class: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const initialState: ISnackbar = {
  body: null,
  class: null,
  autoClose: true,
  autoCloseDelay: 2000
};

export function reducer(state = initialState, action: Action): ISnackbar {
  switch (action.type) {
    case (SNACKBAR_SHOW):
      return Object.assign(
        {},
        state,
        {
          body: action.payload.body,
          autoClose: action.payload.autoClose === undefined ? true : action.payload.autoClose,
          autoCloseDelay: action.payload.autoCloseDelay === undefined ?
            2000 :
            action.payload.autoCloseDelay,
          class: action.payload.class ? action.payload.class : 'success',
        }
      );
    case (SNACKBAR_HIDE):
      return initialState;
    default:
      return state;
  }
};

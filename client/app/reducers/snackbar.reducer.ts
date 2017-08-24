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
  class: 'success',
  autoClose: false,
  autoCloseDelay: 4000
};

export function reducer(state = initialState, action: Action): ISnackbar {
  switch (action.type) {
    case (SNACKBAR_SHOW):
      return Object.assign({}, state, ...action.payload);
    case (SNACKBAR_HIDE):
      return initialState;
    default:
      return state;
  }
};

export const SNACKBAR_SHOW = 'SNACKBAR_SHOW';
export const SNACKBAR_HIDE = 'SNACKBAR_HIDE';

export interface ISnackbar {
  body: string;
  class: string;
  sticky?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const initialState: ISnackbar = {
  body: null,
  sticky: false,
  class: 'success',
  autoClose: false,
  autoCloseDelay: 4000
};

export function reducer(state = initialState, action): ISnackbar {
  switch (action.type) {
    case SNACKBAR_SHOW:
      return Object.assign({}, state, ...action.payload);
    case SNACKBAR_HIDE:
      return initialState;
    default:
      return state;
  }
}

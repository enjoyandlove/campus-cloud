import { Action } from '@ngrx/store';

export const TOGGLE = 'toggle';

export interface IMobile {
  isOpen: boolean;
}

const initialState = {
  isOpen: false
};

export function reducer(state: IMobile = initialState, action: Action) {
  switch (action.type) {
    case TOGGLE:
      return Object.assign({}, state, { isOpen: !state.isOpen });

    default:
      return state;
  }
}

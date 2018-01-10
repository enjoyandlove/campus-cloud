export const TOGGLE = 'TOGGLE';

export interface IMobile {
  isOpen: boolean;
}

const initialState = {
  isOpen: false,
};

export function reducer(state: IMobile = initialState, action) {
  switch (action.type) {
    case TOGGLE:
      return Object.assign({}, state, { isOpen: !state.isOpen });

    default:
      return state;
  }
}

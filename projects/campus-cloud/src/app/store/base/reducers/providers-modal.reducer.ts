export const PROVIDERS_MODAL_SET = 'PROVIDERS_MODAL_SET';
export const PROVIDERS_MODAL_RESET = 'PROVIDERS_MODAL_RESET';

export function reducer(state = [], action) {
  switch (action.type) {
    case PROVIDERS_MODAL_SET:
      return [...action.payload];
    case PROVIDERS_MODAL_RESET:
      return [];
    default:
      return state;
  }
}

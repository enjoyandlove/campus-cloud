export const SERVICES_MODAL_SET = 'SERVICES_MODAL_SET';
export const SERVICES_MODAL_RESET = 'SERVICES_MODAL_RESET';

export function reducer(state = [], action) {
  switch (action.type) {
    case SERVICES_MODAL_SET:
      return [...action.payload];
    case SERVICES_MODAL_RESET:
      return [];
    default:
      return state;
  }
}

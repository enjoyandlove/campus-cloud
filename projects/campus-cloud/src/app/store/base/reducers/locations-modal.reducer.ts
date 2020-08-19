export const LOCATIONS_MODAL_SET = 'LOCATIONS_MODAL_SET';
export const LOCATIONS_MODAL_RESET = 'LOCATIONS_MODAL_RESET';

export function reducer(state = [], action) {
  switch (action.type) {
    case LOCATIONS_MODAL_SET:
      return [...action.payload];
    case LOCATIONS_MODAL_RESET:
      return [];
    default:
      return state;
  }
}

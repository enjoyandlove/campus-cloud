export const CASES_MODAL_SET = 'CASES_MODAL_SET';
export const CASES_MODAL_RESET = 'CASES_MODAL_RESET';

export function reducer(state = [], action) {
  switch (action.type) {
    case CASES_MODAL_SET:
      return [...action.payload];
    case CASES_MODAL_RESET:
      return [];
    default:
      return state;
  }
}

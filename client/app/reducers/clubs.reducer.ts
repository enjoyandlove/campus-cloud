export const CLUBS_MODAL_SET = 'CLUBS_MODAL_SET';
export const CLUBS_MODAL_RESET = 'CLUBS_MODAL_RESET';


export function reducer(state = [], action) {
  switch (action.type) {
    case (CLUBS_MODAL_SET):
      return [...action.payload];
    case (CLUBS_MODAL_RESET):
      return [];
    default:
      return state;
  }
};

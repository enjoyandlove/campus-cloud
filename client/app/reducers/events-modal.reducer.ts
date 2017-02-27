import { Action } from '@ngrx/store';

export const EVENTS_MODAL_SET = 'EVENTS_MODAL_SET';
export const EVENTS_MODAL_RESET = 'EVENTS_MODAL_RESET';


export function reducer(state = [], action: Action) {
  switch (action.type) {
    case (EVENTS_MODAL_SET):
      return [...action.payload];
    case (EVENTS_MODAL_RESET):
      return [];
    default:
      return state;
  }
};

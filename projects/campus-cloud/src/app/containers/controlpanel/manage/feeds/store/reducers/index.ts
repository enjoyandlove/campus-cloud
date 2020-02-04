import { createReducer, on } from '@ngrx/store';
import * as WallsActions from '../actions';

export interface IWallsState {
  bannedEmails: string[];
}

export const initialState: IWallsState = {
  bannedEmails: []
};

const counterReducer = createReducer(
  initialState,
  on(WallsActions.banEmail, (state: IWallsState, { email }) => {
    return {
      ...state,
      bannedEmails: Array.from(new Set([...state.bannedEmails, email]))
    };
  }),
  on(WallsActions.unBanEmail, (state: IWallsState, { email }) => {
    return {
      ...state,
      bannedEmails: state.bannedEmails.filter((e) => e !== email)
    };
  }),
  on(WallsActions.setBannedEmails, (state: IWallsState, { emails }) => {
    return {
      ...state,
      bannedEmails: emails
    };
  })
);

export function reducer(state, action) {
  return counterReducer(state, action);
}

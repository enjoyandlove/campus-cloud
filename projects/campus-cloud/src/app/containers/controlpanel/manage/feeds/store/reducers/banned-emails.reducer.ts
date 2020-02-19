import { createReducer, on, Action } from '@ngrx/store';

import * as WallsActions from '../actions';

export interface IWallsBannedEmailsState {
  emails: string[];
}

export const wallsBannedEmailsinitialState: IWallsBannedEmailsState = {
  emails: []
};

export const _bannedEmailsReducer = createReducer(
  wallsBannedEmailsinitialState,
  on(WallsActions.banEmail, (state: IWallsBannedEmailsState, { email }) => {
    return {
      ...state,
      emails: Array.from(new Set([...state.emails, email]))
    };
  }),
  on(WallsActions.unBanEmail, (state: IWallsBannedEmailsState, { email }) => {
    return {
      ...state,
      emails: state.emails.filter((e) => e !== email)
    };
  }),
  on(WallsActions.setBannedEmails, (state: IWallsBannedEmailsState, { emails }) => {
    return {
      ...state,
      emails
    };
  })
);

export function bannedEmailsReducer(state: IWallsBannedEmailsState, action: Action) {
  return _bannedEmailsReducer(state, action);
}

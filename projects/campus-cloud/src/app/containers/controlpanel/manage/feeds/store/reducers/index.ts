import { IWallsFeedsState } from './feeds.reducer';
import { IWallsBannedEmailsState, bannedEmailsReducer } from './banned-emails.reducer';

export interface IWallsState {
  feeds: IWallsFeedsState;
  bannedEmails: IWallsBannedEmailsState;
}

export { feedsReducer, feedsinitialState } from './feeds.reducer';
export { bannedEmailsReducer, wallsBannedEmailsinitialState } from './banned-emails.reducer';

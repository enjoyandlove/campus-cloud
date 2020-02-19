import { IWallsFeedsState } from './feeds.reducer';
import { IWallsBannedEmailsState, bannedEmailsReducer } from './banned-emails.reducer';

export interface IWallsState {
  feeds: IWallsFeedsState;
  bannedEmails: IWallsBannedEmailsState;
}

export { feedsReducer } from './feeds.reducer';
export { bannedEmailsReducer } from './banned-emails.reducer';

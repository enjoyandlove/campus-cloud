import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IWallsState } from '@controlpanel/manage/feeds/store';

export const getFeatureState = createFeatureSelector<IWallsState>('WALLS_STATE');

export const getBannedEmails = createSelector(
  getFeatureState,
  (state: IWallsState) => state.bannedEmails
);

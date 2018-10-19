import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IDealsState } from './deals';
import { IManageState } from './manage-store.module';

export const getManageState = createFeatureSelector<IManageState>('manage');
// deals
export const getDealsState = createSelector(getManageState, (state: IManageState) => state.deals);
export const getDealsStores = createSelector(getDealsState, (state: IDealsState) => state.stores);
export const getDealsLoaded = createSelector(getDealsState, (state: IDealsState) => state.loaded);
export const getDealsLoading = createSelector(getDealsState, (state: IDealsState) => state.loading);

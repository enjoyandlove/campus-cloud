import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IWallsState } from '@controlpanel/manage/feeds/store';
import { IWallsFeedsState } from './../reducers/feeds.reducer';

export const getFeatureState = createFeatureSelector<IWallsState>('WALLS_STATE');

export const getBannedEmails = createSelector(
  getFeatureState,
  ({ bannedEmails }: IWallsState) => bannedEmails.emails
);

export const getFeedsState = createSelector(
  getFeatureState,
  ({ feeds }: IWallsState) => feeds
);

export const getThreads = createSelector(
  getFeedsState,
  ({ threads }: IWallsFeedsState) => threads
);

export const getExpandedThreadIds = createSelector(
  getFeedsState,
  ({ expandedThreadIds }: IWallsFeedsState) => expandedThreadIds
);

export const getSocialPostCategories = createSelector(
  getFeedsState,
  ({ socialPostCategories }: IWallsFeedsState) => socialPostCategories
);

export const getFilterUsers = createSelector(
  getFeedsState,
  ({ users }: IWallsFeedsState) => users
);

export const getComments = createSelector(
  getFeedsState,
  ({ comments }: IWallsFeedsState) => comments
);

export const getSocialPostCategoryNameByPostType = (postType: any) =>
  createSelector(
    getFeedsState,
    ({ socialPostCategories, group }: IWallsFeedsState) => {
      const postCategory = socialPostCategories.find((c) => c.id === postType);
      // Group Threads do not belong to a Post Category
      return postCategory && !group ? postCategory.name : '';
    }
  );

export const getViewFilters = createSelector(
  getFeedsState,
  ({
    end,
    start,
    group,
    users,
    postType,
    isIntegrated,
    storeCategoryId,
    flaggedByUser,
    flaggedByModerators
  }: IWallsFeedsState) => ({
    end,
    group,
    start,
    users,
    postType,
    isIntegrated,
    flaggedByUser,
    storeCategoryId,
    flaggedByModerators
  })
);

export const getResults = createSelector(
  getFeedsState,
  getViewFilters,
  (state: IWallsFeedsState) => {
    /**
     * filter searched results by current filters state
     */
    const {
      results,
      threads,
      group,
      comments,
      postType,
      flaggedByUser,
      flaggedByModerators
    } = state;

    const filters = [];
    const postTypeFilter = (thread) => thread.post_type === postType.id;
    const flaggedByUserFilter = (thread) => thread.dislikes > 0;
    const flaggedByModeratorsFilter = (thread) => thread.flag < 0;
    const groupIdFilter = (thread) => thread.group_id === group.id;

    if (group) {
      filters.push(groupIdFilter);
    }

    if (flaggedByUser) {
      filters.push(flaggedByUserFilter);
    }

    if (flaggedByModerators) {
      filters.push(flaggedByModeratorsFilter);
    }

    if (postType) {
      filters.push(postTypeFilter);
    }

    const validThreadIds = threads
      .filter((thread) => filters.every((filterFn) => filterFn(thread)))
      .map((t) => t.id);
    const validCommentIds = comments
      .filter((thread) => filters.every((filterFn) => filterFn(thread)))
      .map((t) => t.id);

    return results
      .filter((r) => {
        return r.type === 'THREAD' ? validThreadIds.includes(r.id) : validCommentIds.includes(r.id);
      })
      .map((r) => {
        if (r.type === 'THREAD' && r.children && r.children.length) {
          return {
            ...r,
            children: r.children.filter((commentId) => validCommentIds.includes(commentId))
          };
        }
        return r;
      });
  }
);

export const getThreadById = (threadId: number) =>
  createSelector(
    getFeedsState,
    ({ threads }: IWallsFeedsState) => threads.find((t) => t.id === threadId)
  );

export const getCommentById = (commentId: number) =>
  createSelector(
    getFeedsState,
    ({ comments }: IWallsFeedsState) => comments.find((t) => t.id === commentId)
  );

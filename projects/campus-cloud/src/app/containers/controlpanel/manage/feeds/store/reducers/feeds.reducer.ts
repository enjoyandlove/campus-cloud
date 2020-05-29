import { createReducer, on, Action } from '@ngrx/store';
import { flatten, omit } from 'lodash';

import * as WallsActions from '../actions';
import { ReadyStore } from '@campus-cloud/shared/services';

export interface IWallsFeedsState {
  users: any[];
  threads: any[];
  comments: any[];
  host: ReadyStore;
  group: any | null;
  searchTerm: string;
  end: number | null;
  start: number | null;
  postType: any | null;
  flaggedByUser: boolean;
  socialGroupIds: number[];
  expandedThreadIds: number[];
  socialPostCategories: any[];
  flaggedByModerators: boolean;
  editing: { id: number; type: 'THREAD' | 'COMMENT' } | null;
  results: Array<{ id: number; type: 'THREAD' | 'COMMENT'; children?: number[] }>;
}

export const feedsinitialState: IWallsFeedsState = {
  end: null,
  users: [],
  host: null,
  start: null,
  results: [],
  threads: [],
  comments: [],
  searchTerm: '',
  editing: null,
  socialGroupIds: [],
  flaggedByUser: false,
  expandedThreadIds: [],
  socialPostCategories: [],
  flaggedByModerators: false,
  group: null, // Campus Wall
  postType: null // All Categories,
};

const _feedsReducer = createReducer(
  feedsinitialState,
  on(WallsActions.setSearchTerm, (state: IWallsFeedsState, { term }) => {
    return {
      ...state,
      editing: null,
      searchTerm: term
    };
  }),

  on(WallsActions.setHost, (state: IWallsFeedsState, { host }) => {
    return {
      ...state,
      host
    };
  }),

  on(WallsActions.setEdit, (state: IWallsFeedsState, { editing }) => {
    return {
      ...state,
      editing
    };
  }),

  on(WallsActions.setSocialGroupIds, (state: IWallsFeedsState, { groupIds }) => {
    return {
      ...state,
      socialGroupIds: groupIds
    };
  }),

  on(WallsActions.setFilterUsers, (state: IWallsFeedsState, { user }) => {
    const userExists = state.users.find((u) => u.id === user.id);
    const users = userExists ? state.users.filter((u) => u.id !== user.id) : [...state.users, user];

    return {
      ...state,
      users
    };
  }),
  on(WallsActions.clearFilterUsers, (state: IWallsFeedsState) => {
    return {
      ...state,
      users: []
    };
  }),
  on(WallsActions.setStartFilter, (state: IWallsFeedsState, { start }) => {
    return {
      ...state,
      start
    };
  }),

  on(WallsActions.setEndFilter, (state: IWallsFeedsState, { end }) => {
    return {
      ...state,
      end
    };
  }),
  on(WallsActions.removeResult, (state: IWallsFeedsState, { payload }) => {
    const { resultId, type } = payload;
    return {
      ...state,
      results: state.results.filter((r) => r.id !== resultId && r.type === type)
    };
  }),
  on(WallsActions.expandComments, (state: IWallsFeedsState, { threadId }) => {
    const expanded = state.expandedThreadIds.indexOf(threadId) === -1;

    const expandedThreadIds = !expanded
      ? state.expandedThreadIds.filter((id) => id !== threadId)
      : [...state.expandedThreadIds, threadId];

    return {
      ...state,
      expandedThreadIds
    };
  }),
  on(WallsActions.resetState, (state: IWallsFeedsState) => {
    return {
      ...state,
      ...feedsinitialState
    };
  }),

  on(WallsActions.setSocialPostCategories, (state: IWallsFeedsState, { categories }) => {
    return {
      ...state,
      socialPostCategories: categories
    };
  }),

  on(WallsActions.setGroup, (state: IWallsFeedsState, { group }) => {
    return {
      ...state,
      group
    };
  }),

  on(WallsActions.setPostType, (state: IWallsFeedsState, { postType }) => {
    return {
      ...state,
      postType
    };
  }),

  on(WallsActions.setFlaggedByUser, (state: IWallsFeedsState, { flagged }) => {
    return {
      ...state,
      flaggedByUser: flagged
    };
  }),

  on(WallsActions.setFlaggedByModerator, (state: IWallsFeedsState, { flagged }) => {
    return {
      ...state,
      flaggedByModerators: flagged
    };
  }),

  on(WallsActions.addThreads, (state: IWallsFeedsState, { threads }) => {
    return {
      ...state,
      threads,
      editing: null
    };
  }),

  on(WallsActions.addThread, (state: IWallsFeedsState, { thread }) => {
    return {
      ...state,
      threads: [thread, ...state.threads]
    };
  }),

  on(WallsActions.updateThread, (state: IWallsFeedsState, { thread }) => {
    const searching = state.searchTerm !== '';
    const nonEditableFields = ['display_name'];
    if (searching) {
      nonEditableFields.push('message');
    }
    const changes = omit(thread, nonEditableFields);

    return {
      ...state,
      threads: state.threads.map((t) => (t.id === thread.id ? { ...t, ...changes } : t))
    };
  }),

  on(WallsActions.removeThread, (state: IWallsFeedsState, { threadId }) => {
    return {
      ...state,
      threads: state.threads.filter((t) => t.id !== threadId)
    };
  }),

  on(WallsActions.addComments, (state: IWallsFeedsState, { comments }) => {
    return {
      ...state,
      comments
    };
  }),

  on(WallsActions.addComment, (state: IWallsFeedsState, { comment }) => {
    return {
      ...state,
      comments: [...state.comments, comment]
    };
  }),

  on(WallsActions.updateComment, (state: IWallsFeedsState, { comment }) => {
    return {
      ...state,
      comments: state.comments.map((c) => (c.id === comment.id ? comment : c))
    };
  }),

  on(WallsActions.removeComment, (state: IWallsFeedsState, { commentId }) => {
    return {
      ...state,
      comments: state.comments.filter((c) => c.id !== commentId)
    };
  }),

  on(WallsActions.setResults, (state: IWallsFeedsState, { results }) => {
    const isComment = (r) => Boolean(getParentThreadId(r));

    const comments = results.filter(isComment);
    const hasComments = results.filter(isComment).length > 0;
    const threads = results.filter((r) => !isComment(r));

    if (!hasComments) {
      return {
        ...state,
        threads,
        comments,
        editing: null,
        expandedThreadIds: [],
        results: results.map((r) => ({ id: r.id, type: 'THREAD' }))
      };
    }

    return {
      ...state,
      threads,
      comments,
      expandedThreadIds: [],
      results: groupThreads(results)
    };
  })
);

function groupThreads(sortedData) {
  const isPost = (p) => !('group_thread_id' in p) && !('campus_thread_id' in p);

  const posts = sortedData.filter(isPost);
  const comments = sortedData.filter((p) => !isPost(p));
  const threadIdPostsMap = comments
    .filter((c) => {
      const threadIds = posts.map((p) => p.id);
      const threadId = c.campus_thread_id || c.group_thread_id;
      return threadIds.includes(threadId);
    })
    .reduce((a, b) => {
      const threadIds = posts.map((p) => p.id);
      const threadId = getParentThreadId(b);

      if (threadId in a) {
        a[threadId].push(b.id);
      } else {
        a[threadId] = [b.id];
      }

      return a;
    }, {});

  const commentIds = flatten(Object.values(threadIdPostsMap));
  const orphanedComments = comments.map((c) => c.id).filter((id) => !commentIds.includes(id));
  const results = [];

  sortedData.forEach((p) => {
    if (isPost(p)) {
      const commentIds = p.id in threadIdPostsMap ? threadIdPostsMap[p.id] : [];
      results.push({
        id: p.id,
        type: 'THREAD',
        children: comments.filter((c) => commentIds.includes(c.id)).map((c) => c.id)
      });
    } else {
      if (orphanedComments.includes(p.id)) {
        results.push({ id: p.id, type: 'COMMENT' });
      }
    }
  });

  return results;
}

function getParentThreadId(comment) {
  return comment.campus_thread_id || comment.group_thread_id;
}

export function feedsReducer(state: IWallsFeedsState, action: Action) {
  return _feedsReducer(state, action);
}

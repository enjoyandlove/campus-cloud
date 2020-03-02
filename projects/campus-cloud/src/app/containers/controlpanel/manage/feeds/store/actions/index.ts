import { createAction, props } from '@ngrx/store';

enum FeedsActions {
  BAN_EMAIL = '[manage.walls] ban email',
  UNBAN_EMAIL = '[manage.walls] un-ban email',
  SET_BANNED_EMAILS = '[manage.walls] set banned emails',

  ADD_THREADS = '[manage.walls] add threads',
  ADD_THREAD = '[manage.walls] add thread',
  UPDATE_THREAD = '[manage.walls] update thread',
  REMOVE_THREAD = '[manage.walls] remove thread',

  ADD_COMMENTS = '[manage.walls] add comments',
  ADD_COMMENT = '[manage.walls] add comment',
  UPDATE_COMMENT = '[manage.walls] update comment',
  REMOVE_COMMENT = '[manage.walls] remove comment',

  SET_RESULTS = '[manage.walls] set results',
  REMOVE_RESULT = '[manage.walls] remove result',

  SET_GROUP_ID = '[manage.walls] set group id',
  SET_POST_TYPE = '[manage.walls] set post type',
  SET_FLAGGED_BY_USER = '[manage.walls] set flagged by user',
  SET_SOCIAL_POST_CATEGORIES = '[manage.walls] set social post categories',
  SET_FLAGGED_BY_MODERATORS = '[manage.walls] set flagged by moderators',

  RESET_STATE = '[manage.walls] reset state',

  EXPAND_COMMENTS = '[manage.walls] expand comments'
}

export const setSocialPostCategories = createAction(
  FeedsActions.SET_SOCIAL_POST_CATEGORIES,
  props<{ categories: any[] }>()
);

export const removeResult = createAction(
  FeedsActions.REMOVE_RESULT,
  props<{ payload: { resultId: number; type: string } }>()
);

export const expandComments = createAction(
  FeedsActions.EXPAND_COMMENTS,
  props<{ threadId: number }>()
);

export const setGroupId = createAction(
  FeedsActions.SET_GROUP_ID,
  props<{ groupId: number | null }>()
);

export const resetState = createAction(FeedsActions.RESET_STATE);

export const setPostType = createAction(
  FeedsActions.SET_POST_TYPE,
  props<{ postType: number | null }>()
);

export const setFlaggedByUser = createAction(
  FeedsActions.SET_FLAGGED_BY_USER,
  props<{ flagged: boolean }>()
);

export const setFlaggedByModerator = createAction(
  FeedsActions.SET_FLAGGED_BY_MODERATORS,
  props<{ flagged: boolean }>()
);

export const addThreads = createAction(FeedsActions.ADD_THREADS, props<{ threads: any[] }>());
export const addThread = createAction(FeedsActions.ADD_THREAD, props<{ thread: any }>());
export const updateThread = createAction(FeedsActions.UPDATE_THREAD, props<{ thread: any }>());
export const removeThread = createAction(FeedsActions.REMOVE_THREAD, props<{ threadId: number }>());

export const addComments = createAction(FeedsActions.ADD_COMMENTS, props<{ comments: any[] }>());
export const addComment = createAction(FeedsActions.ADD_COMMENT, props<{ comment: any }>());
export const updateComment = createAction(FeedsActions.UPDATE_COMMENT, props<{ comment: any }>());
export const removeComment = createAction(
  FeedsActions.REMOVE_COMMENT,
  props<{ commentId: number }>()
);

export const setResults = createAction(FeedsActions.SET_RESULTS, props<{ results: any[] }>());

export const banEmail = createAction(FeedsActions.BAN_EMAIL, props<{ email: string }>());
export const unBanEmail = createAction(FeedsActions.UNBAN_EMAIL, props<{ email: string }>());
export const setBannedEmails = createAction(
  FeedsActions.SET_BANNED_EMAILS,
  props<{ emails: string[] }>()
);
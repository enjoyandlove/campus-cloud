import { ICampusThread, ISocialGroupThread } from '@controlpanel/manage/feeds/model';
import { ICampusThreadComment, ISocialGroupThreadComment } from './feeds.interfaces';

export * from './feeds.interfaces';
export * from './social-post-category.model';

export type Feed =
  | ICampusThread
  | ISocialGroupThread
  | ICampusThreadComment
  | ISocialGroupThreadComment;

import { Injectable } from '@angular/core';
import { flatten } from 'lodash';

import { Feed } from '@controlpanel/manage/feeds/model';

/**
 * @deprecated
 * TODO:
 * Avoid this enum, its confusing, the
 * values do not match the values on the API...
 * */
export enum GroupType {
  campus = 0,
  club = 6,
  athletics = 6,
  orientation = 7,
  service = 4
}

@Injectable()
export class FeedsUtilsService {
  static isComment(feed: Feed) {
    return 'campus_thread_id' in feed || 'group_thread_id' in feed;
  }

  static parseComment(comment) {
    return {
      ...comment,
      message: comment.comment
    };
  }

  static groupThreads(sortedData) {
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
        const threadId = b.campus_thread_id || b.group_thread_id;

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
          ...p,
          children: comments.filter((c) => commentIds.includes(c.id))
        });
      } else {
        if (orphanedComments.includes(p.id)) {
          results.push(p);
        }
      }
    });

    return results;
  }

  constructor() {}
}

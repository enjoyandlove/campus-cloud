import { Injectable } from '@angular/core';

import {
  ICampusThread,
  SocialWallContent,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment,
  SocialWallContentObjectType
} from '@controlpanel/manage/feeds/model';

@Injectable({
  providedIn: 'root'
})
export class FeedsSearchUtilsService {
  constructor() {}

  static getThreadIdsBySocialWallContentResults(results: SocialWallContent[]) {
    /**
     * get all ids to be used to call each endpoint separately
     */
    const campusThreadIds = results
      .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.campusThread)
      .map((r: SocialWallContent) => r.id);

    const campusThreadCommentIds = results
      .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.campusComment)
      .map((r: SocialWallContent) => r.id);

    const groupThreadIds = results
      .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.groupThread)
      .map((r: SocialWallContent) => r.id);

    const groupThreadCommentIds = results
      .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.groupComment)
      .map((r: SocialWallContent) => r.id);

    return {
      groupThreadIds,
      campusThreadIds,
      campusThreadCommentIds,
      groupThreadCommentIds
    };
  }

  static replaceMatchedContent(
    threads: (
      | ICampusThread
      | ICampusThreadComment
      | ISocialGroupThread
      | ISocialGroupThreadComment)[],
    results: SocialWallContent[]
  ) {
    /**
     * Convert the array of SocialWallContent into an object
     * whose keys are the resources IDs and the value is the highlighted content
     */
    const resultsAsObject = results.reduce((result, current: SocialWallContent) => {
      result[current.id] = current.highlight;
      return result;
    }, {});
    return threads.map((thread: any) => {
      if (thread.id in resultsAsObject) {
        const messageKey = 'message' in thread ? 'message' : 'comment';
        const { description } = resultsAsObject[thread.id];
        return {
          ...thread,
          [messageKey]: description[0]
        };
      }
      return thread;
    });
  }

  static enforceSocialWallContentOrder(
    results: SocialWallContent[],
    formattedResults: (
      | ICampusThread
      | ICampusThreadComment
      | ISocialGroupThread
      | ISocialGroupThreadComment)[]
  ) {
    /**
     * in order to preserve the ordering from the original response,
     * we need to sort the results from GET by thread_ids request in the
     * same order as we received them when doing the search
     */
    const orderedSearchIds = results.map((r: SocialWallContent) => r.id);
    const formattedResultsAsObject = formattedResults.reduce((result, current) => {
      result[current.id] = current;
      return result;
    }, {});

    return orderedSearchIds
      .filter((resourceId: number) => resourceId in formattedResultsAsObject)
      .map((resourceId: number) => formattedResultsAsObject[resourceId]);
  }
}

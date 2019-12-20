import { catchError, delay } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { mockResult } from './search.mock';
import { ApiService } from '@campus-cloud/base/services';
import { SocialWallContent } from './model/feeds.interfaces';

@Injectable()
export class FeedsService {
  constructor(private api: ApiService) {}

  getCampusWallFeeds(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getGroupWallFeeds(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getChannelsBySchoolId(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getSocialGroups(search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_GROUP}/1;5000`;

    return this.api.get(url, search, true).pipe(catchError(() => of([])));
  }

  upodateSocialGroup(groupId, data, search) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_GROUP}/${groupId}`;

    return this.api.update(url, data, search);
  }

  postToCampusWall(data) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/`;

    return this.api.post(url, data, null, true);
  }

  postToGroupWall(data) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/`;

    return this.api.post(url, data, null, true);
  }

  replyToCampusThread(data) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/`;

    return this.api.post(url, data, null, true);
  }

  replyToGroupThread(data) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/`;

    return this.api.post(url, data, null, true);
  }

  deleteCampusWallMessageByThreadId(threadId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return this.api.delete(url);
  }

  deleteGroupWallMessageByThreadId(threadId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return this.api.delete(url);
  }

  deleteCampusWallCommentByThreadId(commentId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/${commentId}`;

    return this.api.delete(url);
  }

  deleteGroupWallCommentByThreadId(commentId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/${commentId}`;

    return this.api.delete(url);
  }

  approveCampusWallThread(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return this.api.update(url, data);
  }

  approveGroupWallThread(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return this.api.update(url, data);
  }

  approveCampusWallComment(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/${threadId}`;

    return this.api.update(url, data);
  }

  approveGroupWallComment(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/${threadId}`;

    return this.api.update(url, data);
  }

  getCampusWallCommentsByThreadId(search: HttpParams, endRage) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/1;${endRage}`;

    return this.api.get(url, search, true);
  }

  getGroupWallCommentsByThreadId(search: HttpParams, endRage) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/1;${endRage}`;

    return this.api.get(url, search);
  }

  moveCampusWallThreadToChannel(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return this.api.update(url, data);
  }

  searchCampusWall(
    startRange: number,
    endRange: number,
    search: HttpParams
  ): Observable<SocialWallContent[]> {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SEARCH_SOCIAL_WALL_CONTENT}/${startRange};${endRange}`;

    return <Observable<SocialWallContent[]>>this.api.get(url, search, true);
  }

  getCampusThreadByIds(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/`;

    return this.api.get(url, search, true);
  }

  getGroupThreadsByIds(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/`;

    return this.api.get(url, search, true);
  }
}

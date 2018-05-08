import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class FeedsService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, FeedsService.prototype);
  }

  getCampusWallFeeds(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getGroupWallFeeds(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getChannelsBySchoolId(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getSocialGroups(search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/1;5000`;

    return super.get(url, search);
  }

  upodateSocialGroup(groupId, data, search) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/${groupId}`;

    return super.update(url, data, search);
  }

  postToCampusWall(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/`;

    return super.post(url, data, null, true);
  }

  postToGroupWall(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/`;

    return super.post(url, data, null, true);
  }

  replyToCampusThread(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/`;

    return super.post(url, data, null, true);
  }

  replyToGroupThread(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/`;

    return super.post(url, data, null, true);
  }

  deleteCampusWallMessageByThreadId(threadId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.delete(url);
  }

  deleteGroupWallMessageByThreadId(threadId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return super.delete(url);
  }

  deleteCampusWallCommentByThreadId(commentId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/${commentId}`;

    return super.delete(url);
  }

  deleteGroupWallCommentByThreadId(commentId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/${commentId}`;

    return super.delete(url);
  }

  approveCampusWallThread(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.update(url, data);
  }

  approveGroupWallThread(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return super.update(url, data);
  }

  approveCampusWallComment(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/${threadId}`;

    return super.update(url, data);
  }

  approveGroupWallComment(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/${threadId}`;

    return super.update(url, data);
  }

  getCampusWallCommentsByThreadId(search: HttpParams, endRage) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/1;${endRage}`;

    return super.get(url, search);
  }

  getGroupWallCommentsByThreadId(search: HttpParams, endRage) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/1;${endRage}`;

    return super.get(url, search);
  }

  moveCampusWallThreadToChannel(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.update(url, data);
  }
}

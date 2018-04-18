import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class FeedsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, FeedsService.prototype);
  }

  getCampusWallFeeds(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getGroupWallFeeds(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getChannelsBySchoolId(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getSocialGroups(search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/1;5000`;

    return super.get(url, { search }).map((res) => res.json());
  }

  upodateSocialGroup(groupId, data, search) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/${groupId}`;

    return super.update(url, data, { search }).map((res) => res.json());
  }

  postToCampusWall(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/`;

    return super.post(url, data, null, true).map((res) => res.json());
  }

  postToGroupWall(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/`;

    return super.post(url, data, null, true).map((res) => res.json());
  }

  replyToCampusThread(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/`;

    return super.post(url, data, null, true).map((res) => res.json());
  }

  replyToGroupThread(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/`;

    return super.post(url, data, null, true).map((res) => res.json());
  }

  deleteCampusWallMessageByThreadId(threadId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.delete(url).map((res) => res.json());
  }

  deleteGroupWallMessageByThreadId(threadId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return super.delete(url).map((res) => res.json());
  }

  deleteCampusWallCommentByThreadId(commentId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/${commentId}`;

    return super.delete(url).map((res) => res.json());
  }

  deleteGroupWallCommentByThreadId(commentId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/${commentId}`;

    return super.delete(url).map((res) => res.json());
  }

  approveCampusWallThread(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.update(url, data).map((res) => res.json());
  }

  approveGroupWallThread(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return super.update(url, data).map((res) => res.json());
  }

  approveCampusWallComment(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/${threadId}`;

    return super.update(url, data).map((res) => res.json());
  }

  approveGroupWallComment(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/${threadId}`;

    return super.update(url, data).map((res) => res.json());
  }

  getCampusWallCommentsByThreadId(search: URLSearchParams, endRage) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/1;${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getGroupWallCommentsByThreadId(search: URLSearchParams, endRage) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.GROUP_COMMENT}/1;${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  moveCampusWallThreadToChannel(threadId: number, data: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.update(url, data).map((res) => res.json());
  }
}

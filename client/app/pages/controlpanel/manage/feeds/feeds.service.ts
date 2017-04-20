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

  getFeeds(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getChannelsBySchoolId(startRange: number, endRange: number, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_POST_CATEGORY}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getSocialGroups(search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SOCIAL_GROUP}/1;100`;

    return super.get(url, { search }).map(res => res.json());
  }

  postToWall(data) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/`;

    return super.post(url, data).map(res => res.json());
  }

  deleteMessageById(threadId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return super.delete(url).map(res => res.json());
  }

  deleteCommentById(commentId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/${commentId}`;

    return super.delete(url).map(res => res.json());
  }


  getCommentsByFeedId(search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CAMPUS_COMMENT}/`;

    return super.get(url, { search }).map(res => res.json());
  }
}

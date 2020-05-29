import { catchError, tap, take } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { ApiService } from '@campus-cloud/base/services';
import { baseActionClass } from '@campus-cloud/store/base';
import { SocialWallContent } from './model/feeds.interfaces';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { FeedsExportUtilsService } from '@controlpanel/manage/feeds/feeds-export.utils.service';
import {
  IDataExportWallsPost,
  IDataExportGroupThread,
  IDataExportWallsComment,
  IDataExportGroupThreadComment
} from '@controlpanel/manage/feeds/model';

@Injectable()
export class FeedsService {
  constructor(
    private api: ApiService,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private store: Store<ISnackbar>,
    private cpTracking: CPTrackingService,
    private dataExportUtils: FeedsExportUtilsService,
    private feedsAmplitudeService: FeedsAmplitudeService
  ) {}

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

    return this.api.get(url, search).pipe(catchError(() => of([])));
  }

  getSocialGroups(search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_GROUP}/1;5000`;

    return this.api.get(url, search, true).pipe(catchError(() => of([])));
  }

  getSocialGroupById(groupId, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SOCIAL_GROUP}/${groupId}`;

    return this.api.get(url, search, true).pipe(catchError(() => of({})));
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

    return this.api.delete(url, null, true);
  }

  deleteGroupWallMessageByThreadId(threadId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return this.api.delete(url, null, true);
  }

  deleteCampusWallCommentByThreadId(commentId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/${commentId}`;

    return this.api.delete(url, null, true);
  }

  deleteGroupWallCommentByThreadId(commentId: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/${commentId}`;

    return this.api.delete(url, null, true);
  }

  updateGroupWallThread(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/${threadId}`;

    return this.api.update(url, data);
  }

  updateCampusWallComment(threadId: number, data: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/${threadId}`;

    return this.api.update(url, data);
  }

  updateGroupWallComment(threadId: number, data: any) {
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

  updateCampusWallThread(threadId: number, data: any) {
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

  getGroupThreadById(threadId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/${threadId}`;
    return this.api.get(url, search, true);
  }

  getCampusThreadById(threadId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_THREAD}/${threadId}`;

    return this.api.get(url, search, true);
  }

  getGroupThreadsByIds(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_THREAD}/`;

    return this.api.get(url, search, true);
  }

  getCampusCommentsByIds(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CAMPUS_COMMENT}/`;

    return this.api.get(url, search, true);
  }

  getGroupCommentsByIds(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.GROUP_COMMENT}/`;

    return this.api.get(url, search, true);
  }

  getCampusWallsPostsExportData(params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXPORT_DATA_WALL_POST}/`;

    return this.api.get(url, params, true);
  }

  getCampusWallsCommentExportData(params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXPORT_DATA_WALL_COMMENT}/`;

    return this.api.get(url, params, true);
  }

  getGroupThreadExportData(params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXPORT_GROUP_THREADS}/`;

    return this.api.get(url, params, true);
  }

  getGroupCommentExportData(params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXPORT_GROUP_COMMENTS}/`;

    return this.api.get(url, params, true);
  }

  generateReport(
    stream: Observable<
      | [IDataExportGroupThread[], IDataExportGroupThreadComment[]]
      | [IDataExportWallsPost[], IDataExportWallsComment[]]
    >
  ) {
    return stream.pipe(
      take(1),
      tap(async ([wall, comment]) => {
        await this.dataExportUtils.compressFiles(wall, comment);
        this.trackCommunityExportThread();
        this.handleSuccess();
      })
    );
  }

  private handleSuccess() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('t_community_data_export_success')
      })
    );
  }

  private trackCommunityExportThread() {
    const { sub_menu_name, ...amplitude } = this.feedsAmplitudeService.getWallFiltersAmplitude();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.COMMUNITY_DOWNLOADED_REPORT, amplitude);
  }
}

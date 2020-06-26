/* tslint:disable:no-host-metadata-property */
import { OnInit, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {
  tap,
  map,
  take,
  share,
  mapTo,
  filter,
  switchMap,
  startWith,
  catchError
} from 'rxjs/operators';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { baseActionClass, baseActions } from '@campus-cloud/store/base';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { CPI18nService, StoreService, ReadyStore } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import {
  ICampusThread,
  ISocialGroup,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment
} from '@controlpanel/manage/feeds/model';

@Component({
  selector: 'cp-feeds-info',
  templateUrl: './feeds-info.component.html',
  styleUrls: ['./feeds-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-feeds-info'
  }
})
export class FeedsInfoComponent implements OnInit {
  feedId: number;
  groupId: number;
  layoutWidth = LayoutWidth.third;
  filters$ = this.store.pipe(select(fromStore.getViewFilters));
  selectedHost$: Observable<ReadyStore> = this.store.pipe(select(fromStore.getHost));
  comments$: BehaviorSubject<
    ICampusThreadComment[] | ISocialGroupThreadComment[]
  > = new BehaviorSubject([]);
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null
  });

  view$: Observable<{
    loading: boolean;
    host: ReadyStore;
    readOnly: boolean;
    socialGroup: ISocialGroup;
    feed: ICampusThread | ISocialGroupThread;
    comments: ICampusThreadComment[] | ISocialGroupThreadComment[];
  }>;

  constructor(
    public router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    public feedService: FeedsService,
    private storeService: StoreService,
    private store: Store<fromStore.IWallsState>,
    private feedAmplitude: FeedsAmplitudeService
  ) {}

  ngOnInit() {
    this.feedId = this.route.snapshot.params['feedId'];
    const groupId = this.route.snapshot.queryParams['groupId'];
    this.groupId = groupId > 0 ? groupId : null;
    const schoolId = this.route.snapshot.queryParams['school'];

    if (schoolId) {
      this.feedAmplitude.trackViewedPostDetail('Daily Summary Email');
    }

    const request$ = this.fetch().pipe(share());

    const getFeedFromState = () =>
      this.store.select(fromStore.getThreads).pipe(map((feeds) => feeds[0]));

    const host$ = request$.pipe(
      map(({ host }) => host),
      startWith({})
    );
    const feed$ = request$.pipe(
      switchMap(getFeedFromState),
      startWith({})
    );

    const loading$ = request$.pipe(
      mapTo(false),
      startWith(true)
    );

    this.view$ = combineLatest([
      loading$,
      host$,
      this.filters$,
      this.selectedHost$,
      feed$,
      this.comments$
    ]).pipe(
      map(([loading, host, { group }, selectedHost, feed, comments]) => {
        const feedIsDeleted = JSON.stringify(feed) === '{}' || (feed && feed.flag === -3);
        const updatedFeed = {
          ...feed,
          comment_count: comments.length
        };
        const _host = selectedHost ? selectedHost : host;
        return {
          host: _host,
          feed: feedIsDeleted ? null : updatedFeed,
          loading,
          comments,
          socialGroup: group,
          readOnly: !_host && !group
        };
      })
    );

    this.isCampusWallView$.next({
      type: this.groupId ? this.groupId : 1,
      group_id: this.groupId
    });

    this.loadGroups();
    this.buildHeader();
    this.loadCategories();
  }

  approvedHandler(approvedComment: ICampusThreadComment | ISocialGroupThreadComment) {
    const { id } = approvedComment;
    const comments = this.comments$.value as (ICampusThreadComment | ISocialGroupThreadComment)[];
    const updatedComments = comments.map((c) => (c.id === id ? approvedComment : c)) as
      | ICampusThreadComment[]
      | ISocialGroupThreadComment[];
    this.comments$.next(updatedComments);
  }

  onDeletedComment(comment: ICampusThreadComment | ISocialGroupThreadComment) {
    const comments = this.comments$.value as (ICampusThreadComment | ISocialGroupThreadComment)[];
    const updatedComments = comments.filter(({ id }) => id !== comment.id) as
      | ICampusThreadComment[]
      | ISocialGroupThreadComment[];
    this.comments$.next(updatedComments);
  }

  onReplied(comment: ICampusThreadComment | ISocialGroupThreadComment) {
    const comments = this.comments$.value;
    const udpatedComments = [...comments, comment] as
      | ICampusThreadComment[]
      | ISocialGroupThreadComment[];
    this.comments$.next(udpatedComments);
  }

  deleteThreadHandler() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('t_community_post_delete_success')
      })
    );

    this.router.navigate(['/manage/feeds']);
  }

  getHost(feed: ICampusThread | ISocialGroupThread) {
    const updateState = (host: ReadyStore) => this.store.dispatch(fromStore.setHost({ host }));

    const params = new HttpParams().set('school_id', this.session.school.id.toString());
    if (!this.groupId) {
      const { extern_poster_id = null } = feed || {};
      const { comment } = this.route.snapshot.queryParams;

      if (!extern_poster_id && comment) {
        return this.feedService.getCampusWallCommentById(comment, params).pipe(
          switchMap((c: ICampusThreadComment) =>
            this.storeService.getStoreById(c.extern_poster_id, params).pipe(
              catchError(() => of(null)),
              tap(updateState.bind(this))
            )
          )
        );
      }
      return this.storeService.getStoreById(extern_poster_id, params).pipe(
        catchError(() => of(null)),
        tap(updateState.bind(this))
      );
    }
    return this.feedService.getSocialGroupById(this.groupId, params).pipe(
      catchError(() => of(null)),
      tap(
        (group: ISocialGroup) => this.store.dispatch(fromStore.setGroup({ group })),
        tap(updateState.bind(this))
      )
    );
  }

  getThread(): Observable<ICampusThread | ISocialGroupThread> {
    const { comment } = this.route.snapshot.queryParams;
    let params = new HttpParams();
    params = this.groupId
      ? params.set('group_id', this.groupId.toString())
      : params.set('school_id', this.session.school.id.toString());

    const errorHandler = () => {
      if (!comment) {
        this.handleError();
        this.router.navigate(['/manage/feeds']);
      }
      return of({});
    };

    const updateState = (thread: ICampusThread | ISocialGroupThread) =>
      this.store.dispatch(fromStore.addThread({ thread }));

    const stream$ = this.groupId
      ? this.feedService.getGroupThreadById(this.feedId, params)
      : this.feedService.getCampusThreadById(this.feedId, params);

    return stream$.pipe(
      catchError(errorHandler),
      tap(updateState),
      share()
    );
  }

  fetch(): Observable<{
    host: any;
    feed: ICampusThread | ISocialGroupThread;
    comments: ICampusThreadComment[] | ISocialGroupThreadComment[];
  }> {
    const thread$ = this.getThread().pipe(share());
    const host$ = thread$.pipe(switchMap(this.getHost.bind(this)));
    const comments$ = thread$.pipe(switchMap(this.commentsByFeedId$.bind(this)));

    return combineLatest([thread$, comments$, host$]).pipe(
      map(([feed, comments, host]) => {
        this.comments$.next(comments);
        return {
          feed,
          host,
          comments
        };
      })
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('t_community_post_not_exist')
      })
    );
  }

  loadCategories() {
    const _search = new HttpParams().append(
      'school_id',
      this.session.g.get('school').id.toString()
    );

    this.store
      .select(fromStore.getSocialPostCategories)
      .pipe(
        take(1),
        filter((channels) => !!channels),
        switchMap(() => {
          return this.feedService
            .getChannelsBySchoolId(1, 1000, _search)
            .pipe(
              tap((results: any) =>
                this.store.dispatch(fromStore.setSocialPostCategories({ categories: results }))
              )
            );
        })
      )
      .subscribe();
  }

  loadGroups() {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    this.store
      .select(fromStore.getSocialGroupIds)
      .pipe(
        take(1),
        filter((socialGroupIds) => !!socialGroupIds),
        switchMap(() => {
          return this.feedService.getSocialGroups(params).pipe(
            map((groups: ISocialGroup[]) => groups.map((g) => g.related_obj_id)),
            tap((groups) => this.store.dispatch(fromStore.setSocialGroupIds({ groupIds: groups })))
          );
        })
      )
      .subscribe();
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: {
          heading: `t_community_post_details`,
          subheading: null,
          em: null,
          crumbs: {
            url: `/manage/feeds`,
            label: `feeds`
          },
          children: []
        }
      });
    });
  }

  commentsByFeedId$(
    feed: ICampusThread | ISocialGroupThread
  ): Observable<ICampusThreadComment[] | ISocialGroupThreadComment[]> {
    const { comment_count = 15 } = feed;
    if (comment_count === 0) {
      return of([]);
    }

    let params = new HttpParams().append('thread_id', this.feedId.toString());

    if (this.groupId) {
      params = params.append('group_id', this.groupId.toString());
    } else {
      params = params.append('school_id', this.session.g.get('school').id.toString());
    }
    const groupComments$ = this.feedService.getGroupWallCommentsByThreadId(
      params,
      comment_count + 1
    ) as Observable<ISocialGroupThreadComment[]>;
    const campusWallComments$ = this.feedService.getCampusWallCommentsByThreadId(
      params,
      comment_count + 1
    ) as Observable<ICampusThreadComment[]>;

    return this.groupId ? groupComments$ : campusWallComments$;
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, withLatestFrom, map, startWith } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActionClass, ISnackbar } from '@campus-cloud/store/base';
import { ICampusThread, ISocialGroupThread } from '@controlpanel/manage/feeds/model';

interface IState {
  comments: Array<any>;
}

const state: IState = {
  comments: []
};

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-comments',
  templateUrl: './feed-comments.component.html',
  styleUrls: ['./feed-comments.component.scss']
})
export class FeedCommentsComponent extends BaseComponent implements OnInit, OnDestroy {
  _feed: BehaviorSubject<ICampusThread | ISocialGroupThread> = new BehaviorSubject(null);

  @Input()
  set feed(feed: ICampusThread | ISocialGroupThread) {
    this._feed.next(feed);
  }

  get feed() {
    return this._feed.value;
  }
  @Input() groupId: number;
  @Input() postType: number;
  @Input() groupType: GroupType;
  @Input() readOnlyMode: boolean;
  @Input() isCampusWallView: Observable<{}>;
  @Output() deleted: EventEmitter<null> = new EventEmitter();
  @Output() replied: EventEmitter<null> = new EventEmitter();

  comments;
  _isCampusWallView;
  isReplyView = true;
  campusGroupId: number;
  state: IState = state;
  view$: Observable<{
    loading: boolean;
  }>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    public feedsService: FeedsService,
    private store: Store<ISnackbar | fromStore.IWallsState>
  ) {
    super();
    this.endRange = 10000;
    this.maxPerPage = 10000;
  }

  onReplied() {
    this.replied.emit();
    this.fetch();
  }

  onApproved(commentId: number) {
    this.state = {
      ...this.state,
      comments: this.state.comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              dislikes: c.dislikes > 1 ? c.dislikes - 1 : 0
            }
          : c
      )
    };
  }

  onDeletedComment(commentId: number) {
    const _state = Object.assign({}, this.state);

    _state.comments = _state.comments.filter((comment) => comment.id !== commentId);

    this.state = Object.assign({}, this.state, { comments: _state.comments });
    this.deleted.emit();
  }

  editedHanlder(changes) {
    this.state = {
      ...this.state,
      comments: this.state.comments.map((c) => (c.id === changes.id ? changes : c))
    };
  }

  private fetch() {
    let search = new HttpParams().append('thread_id', this.feed.id.toString());

    search = this._isCampusWallView
      ? search.append('school_id', this.session.g.get('school').id.toString())
      : search.append('group_id', this.campusGroupId.toString());

    const campusWallComments$ = this.feedsService.getCampusWallCommentsByThreadId(
      search,
      this.feed.comment_count + 1
    );
    const groupWallComments$ = this.feedsService.getGroupWallCommentsByThreadId(
      search,
      this.feed.comment_count + 1
    );
    let stream$ = this._isCampusWallView ? campusWallComments$ : groupWallComments$;
    stream$ = stream$.pipe(withLatestFrom(this.store.pipe(select(fromStore.getComments))));

    super.fetchData(stream$).then(
      (res) => {
        const [comments, matchedComments = []] = res.data;
        const matchedCommentIds = matchedComments.map((c) => c.id);
        const getMatchedCommentById = (commentId) =>
          matchedComments.find((c) => c.id === commentId);

        this.state = Object.assign({}, this.state, {
          comments: comments.map((c) =>
            matchedCommentIds.includes(c.id) ? getMatchedCommentById(c.id) : c
          )
        });
      },
      () => this.handleError()
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  ngOnInit() {
    this.view$ = combineLatest([super.isLoading().pipe(startWith(true))]).pipe(
      map(([loading]) => ({
        loading
      }))
    );
    this.endRange = this.feed.comment_count + 1;
    this.maxPerPage = this.feed.comment_count + 1;

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.campusGroupId = res.type;
      this._isCampusWallView = res.type === 1;
    });
    this.fetch();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}

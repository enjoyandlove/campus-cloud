import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

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
  @Input() feed;
  @Input() groupId: number;
  @Input() postType: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<{}>;
  @Output() deleted: EventEmitter<null> = new EventEmitter();
  @Output() replied: EventEmitter<null> = new EventEmitter();

  loading;
  comments;
  _isCampusWallView;
  isReplyView = true;
  campusGroupId: number;
  state: IState = state;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(private session: CPSession, public feedsService: FeedsService) {
    super();
    this.endRange = 10000;
    this.maxPerPage = 10000;
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onReplied() {
    this.replied.emit();
    this.fetch();
  }

  onDeletedComment(commentId: number) {
    const _state = Object.assign({}, this.state);

    _state.comments = _state.comments.filter((comment) => comment.id !== commentId);

    this.state = Object.assign({}, this.state, { comments: _state.comments });
    this.deleted.emit();
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
    const stream$ = this._isCampusWallView ? campusWallComments$ : groupWallComments$;

    super.fetchData(stream$).then((res) => {
      const _comments = [];

      res.data.map((comment) => {
        _comments.push({
          id: comment.id,
          avatar_thumb: comment.avatar_thumb,
          image_list: comment.image_list,
          message: comment.comment,
          likes: comment.likes,
          flag: comment.flag,
          email: comment.email,
          dislikes: comment.dislikes,
          user_status: comment.user_status,
          display_name: comment.display_name,
          added_time: comment.added_time
        });
      });
      this.state = Object.assign({}, this.state, { comments: _comments });
    });
  }

  ngOnInit() {
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

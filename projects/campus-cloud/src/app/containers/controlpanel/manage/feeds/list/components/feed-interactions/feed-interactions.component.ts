import { Input, OnInit, Component, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { catchError, map, share, mapTo, startWith, switchMap } from 'rxjs/operators';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { Observable, of, combineLatest } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import {
  InteractionLikeType,
  InteractionContentType,
  SocialContentInteractionItem,
  SocialContentInteractionService
} from '@campus-cloud/services';

import {
  ICampusThread,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment
} from '@controlpanel/manage/feeds/model';
import { CPSession } from '@campus-cloud/session';

type Feed = ICampusThread | ISocialGroupThread | ICampusThreadComment | ISocialGroupThreadComment;

@Component({
  selector: 'cp-feed-interactions',
  templateUrl: './feed-interactions.component.html',
  styleUrls: ['./feed-interactions.component.scss'],
  providers: [SocialContentInteractionService, ModalService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedInteractionsComponent implements OnInit {
  modal;

  @Input()
  feed: Feed;

  @Input()
  likeType: InteractionLikeType;

  @Input()
  maxCount: string;

  students$: Observable<SocialContentInteractionItem[]>;
  filters$ = this.store.pipe(select(fromStore.getViewFilters)).pipe(share());

  constructor(
    private session: CPSession,
    private modalService: ModalService,
    private store: Store<fromStore.IWallsState>,
    private service: SocialContentInteractionService
  ) {}

  ngOnInit(): void {
    this.students$ = +this.maxCount === 0 ? of([]) : this.fetch();
  }

  fetch(endRange = 5) {
    const isGroupWall$ = this.filters$.pipe(map(({ group }) => Boolean(group)));
    const contentType$ = isGroupWall$.pipe(
      map((isGroup) => {
        const isComment = 'campus_thread_id' in this.feed || 'group_thread_id' in this.feed;

        if (isGroup) {
          return isComment
            ? InteractionContentType.socialGroupComment
            : InteractionContentType.socialGroupThread;
        }

        return isComment
          ? InteractionContentType.campusComment
          : InteractionContentType.campusThread;
      })
    );

    return contentType$.pipe(
      switchMap((contentType: number) => {
        let groupId: number;
        const schoolId = this.session.school.id.toString();

        if (
          contentType === InteractionContentType.socialGroupComment ||
          contentType === InteractionContentType.socialGroupThread
        ) {
          groupId = (this.feed as ISocialGroupThreadComment).group_id;
        }

        let params = new HttpParams();
        params = params
          .set('content_id', this.feed.id.toString())
          .set('like_type', this.likeType.toString())
          .set('content_type', contentType.toString())
          .set('school_id', groupId ? null : schoolId)
          .set('group_id', groupId ? groupId.toString() : null);

        return this.service.get(1, endRange, params).pipe(catchError(() => of([]))) as Observable<
          SocialContentInteractionItem[]
        >;
      })
    );
  }

  modalHandler(modalTpl: TemplateRef<any>) {
    const request$ = this.fetch(+this.maxCount).pipe(share());
    const loading$ = request$.pipe(
      mapTo(false),
      startWith(true)
    );

    const view$ = combineLatest([request$.pipe(startWith([])), loading$]).pipe(
      map(([people, loading]) => ({
        people,
        loading
      }))
    );

    this.modal = this.modalService.open(modalTpl, {
      view$
    });
  }

  closeModal() {
    this.modal.dispose();
  }
}

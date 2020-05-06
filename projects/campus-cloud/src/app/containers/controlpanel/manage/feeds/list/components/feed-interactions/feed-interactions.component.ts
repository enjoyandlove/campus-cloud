import {
  Input,
  OnInit,
  Component,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { map, tap, share, mapTo, repeat, startWith, catchError, switchMap } from 'rxjs/operators';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { Observable, of, combineLatest, fromEvent, merge, interval } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import {
  InteractionLikeType,
  InteractionContentType,
  SocialContentInteractionItem,
  SocialContentInteractionService
} from '@campus-cloud/services';
import { CPSession } from '@campus-cloud/session';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { Feed, ISocialGroupThreadComment } from '@controlpanel/manage/feeds/model';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

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

  tooltip$: Observable<{
    loading: boolean;
    users: SocialContentInteractionItem[];
  }>;

  filters$ = this.store.pipe(select(fromStore.getViewFilters));

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private modalService: ModalService,
    private amplitude: FeedsAmplitudeService,
    private store: Store<fromStore.IWallsState>,
    public service: SocialContentInteractionService
  ) {}

  ngOnInit(): void {
    const mouseEnter$ = fromEvent(this.el.nativeElement, 'mouseenter');

    const data$ = mouseEnter$.pipe(switchMap(() => this.fetch()));
    const loading$ = merge(mouseEnter$.pipe(mapTo(true)), data$.pipe(mapTo(false))).pipe(
      startWith(true)
    );

    this.tooltip$ = combineLatest([data$.pipe(startWith([])), loading$]).pipe(
      map(([users, loading]) => ({
        users,
        loading
      }))
    );
  }

  fetch(endRange = 5) {
    const isGroupWall$ = this.filters$.pipe(map(({ group }) => Boolean(group), repeat()));
    const contentType$ = isGroupWall$.pipe(
      map((isGroup) => {
        const isComment = FeedsUtilsService.isComment(this.feed);

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

        return this.service.get(1, endRange, params).pipe(
          tap(() => this.amplitude.trackViewedUserList(this.feed, this.likeType)),
          catchError(() => of([]))
        ) as Observable<SocialContentInteractionItem[]>;
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

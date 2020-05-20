import {
  Input,
  OnInit,
  Component,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { map, share, mapTo, repeat, startWith, catchError, switchMap } from 'rxjs/operators';
import { Observable, of, combineLatest, fromEvent, merge } from 'rxjs';
import { ModalService } from '@ready-education/ready-ui/overlays';
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
  total: number;

  @Input()
  feed: Feed;

  @Input()
  likeType: InteractionLikeType;

  tooltip$: Observable<{
    loading: boolean;
    profiles: SocialContentInteractionItem[];
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
    this.total = +this.likeType === InteractionLikeType.like ? this.feed.likes : this.feed.dislikes;
    const mouseEnter$ = fromEvent(this.el.nativeElement, 'mouseenter');

    const data$ = mouseEnter$.pipe(switchMap(() => this.fetch()));
    const loading$ = merge(mouseEnter$.pipe(mapTo(true)), data$.pipe(mapTo(false))).pipe(
      startWith(true)
    );

    this.tooltip$ = combineLatest([data$.pipe(startWith([])), loading$]).pipe(
      map(([profiles, loading]) => ({
        profiles,
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

        return this.service.get(1, endRange, params).pipe(catchError(() => of([]))) as Observable<
          SocialContentInteractionItem[]
        >;
      })
    );
  }

  modalHandler(modalTpl: TemplateRef<any>) {
    const request$ = this.fetch(this.total).pipe(share());
    const loading$ = request$.pipe(
      mapTo(false),
      startWith(true)
    );

    const view$ = combineLatest([request$.pipe(startWith([])), loading$]).pipe(
      map(([profiles, loading]) => ({
        profiles,
        loading
      }))
    );

    this.modal = this.modalService.open(modalTpl, {
      view$
    });

    this.amplitude.trackViewedUserList(this.feed, this.likeType);
  }

  closeModal() {
    this.modal.dispose();
  }
}

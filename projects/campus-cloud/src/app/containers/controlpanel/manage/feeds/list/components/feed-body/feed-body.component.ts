/* tslint:disable:no-host-metadata-property */
import {
  Input,
  OnInit,
  Output,
  Component,
  OnDestroy,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { map, startWith, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { of, Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cp-feed-body'
  }
})
export class FeedBodyComponent implements OnInit, OnDestroy {
  @Input() mode: 'default' | 'search' | 'inline';

  _feed: BehaviorSubject<any> = new BehaviorSubject(null);

  @Input()
  set feed(feed: any) {
    this._feed.next(feed);
  }

  get feed() {
    return this._feed.value;
  }

  get parentThread() {
    return 'group_thread_id' in this.feed ? this.feed.group_thread_id : this.feed.campus_thread_id;
  }
  @Input() isComment: boolean;
  @Input() wallCategory: string;

  @Output() edited: EventEmitter<any> = new EventEmitter();

  destroy$ = new Subject<null>();
  view$: Observable<{
    editMode: boolean;
  }>;

  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    public feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  ngOnInit() {
    const editMode$ = this.store.pipe(select(fromStore.getEditing)).pipe(
      map((editing) => editing && editing.id === this.feed.id),
      takeUntil(this.destroy$),
      startWith(false)
    );

    this.view$ = combineLatest([editMode$]).pipe(
      distinctUntilChanged(),
      map(([editMode]) => ({
        editMode
      }))
    );
  }

  ngOnDestroy() {
    this.emitDestroy();
  }

  updateHandler(changes) {
    this.feed = {
      ...this.feed,
      ...changes
    };

    this.edited.emit(changes);
  }

  trackViewLightBoxEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.COMMUNITY_VIEWED_IMAGE,
      this.feedsAmplitudeService.getWallViewedImageAmplitude(this.feed, this.isComment)
    );
  }
}

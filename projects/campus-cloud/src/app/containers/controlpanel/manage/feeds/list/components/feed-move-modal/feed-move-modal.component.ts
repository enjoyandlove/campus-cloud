import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../../../store';

import { FeedsService } from '../../../feeds.service';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-move-modal',
  templateUrl: './feed-move-modal.component.html',
  styleUrls: ['./feed-move-modal.component.scss']
})
export class FeedMoveComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Output() moved: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  channels$;
  buttonData;
  currentChannel$;
  form: FormGroup;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    upload_image: null,
    campus_wall_category: null
  };

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private fb: FormBuilder,
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    public feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
  ) {
    this.form = this.fb.group({
      post_type: [null, Validators.required]
    });
  }

  onSelectedChannel(post_type) {
    this.form.controls['post_type'].setValue(post_type.action);

    this.eventProperties = {
      ...this.eventProperties,
      campus_wall_category: post_type.label
    };
  }

  onSubmit() {
    this.feedsService
      .moveCampusWallThreadToChannel(this.feed.id, this.form.value)
      .subscribe((res) => {
        this.store.dispatch(fromStore.updateThread({ thread: res }));
        this.trackAmplitudeEvent(this.feed);
        $('#moveFeedModal').modal('hide');
        this.moved.emit(res);
      });
  }

  trackAmplitudeEvent(feed) {
    this.eventProperties = {
      ...this.eventProperties,
      post_id: feed.id,
      likes: this.utils.hasLikes(feed.likes),
      upload_image: this.utils.hasImage(feed.has_image),
      comments: this.utils.hasComments(feed.comment_count)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_MOVED_POST, this.eventProperties);
  }

  ngOnInit() {
    this.currentChannel$ = this.store.pipe(
      select(fromStore.getSocialPostCategoryNameByPostType(this.feed.post_type))
    );

    this.channels$ = this.store.pipe(select(fromStore.getSocialPostCategories)).pipe(
      map((channels) => {
        return [
          { label: '---', action: null },
          ...channels.map((c) => ({ label: c.name, action: c.id }))
        ];
      }),
      startWith([{ label: '---' }])
    );

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('move'),
      disabled: true
    };

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}

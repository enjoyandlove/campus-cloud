import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-feed-move-modal',
  templateUrl: './feed-move-modal.component.html',
  styleUrls: ['./feed-move-modal.component.scss']
})
export class FeedMoveComponent implements OnInit {
  @Input() feed: any;
  @Output() moved: EventEmitter<number> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  channels$;
  buttonData;
  currentChannel;
  form: FormGroup;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_source: null,
    upload_image: null,
    campus_wall_category: null
  };

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    private feedsService: FeedsService,
    private cpTracking: CPTrackingService
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
      .subscribe((_) => {
        this.trackAmplitudeEvent(this.feed);
        $('#moveFeedModal').modal('hide');
        this.moved.emit(this.feed.id);
      });
  }

  trackAmplitudeEvent(feed) {
    this.eventProperties = {
      ...this.eventProperties,
      post_id: feed.id,
      wall_source: amplitudeEvents.CAMPUS,
      likes: this.utils.hasLikes(feed.likes),
      upload_image: this.utils.hasImage(feed.has_image),
      comments: this.utils.hasComments(feed.comment_count)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_MOVED_POST, this.eventProperties);
  }

  ngOnInit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 1000, search).pipe(
      startWith([{ label: '---' }]),
      map((channels) => {
        const _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach((channel: any) => {
          if (this.feed.post_type === channel.id) {
            this.currentChannel = channel.name;
          }
          const _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      })
    );

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('move'),
      disabled: true
    };

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }
}

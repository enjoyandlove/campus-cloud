import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';

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

  schoolId;
  channels$;
  currentChannel;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedsService: FeedsService
  ) {
    this.form = this.fb.group({
      'post_type': [null, Validators.required]
    });
  }

  onSelectedChannel(post_type) {
    this.form.controls['post_type'].setValue(post_type.action);
  }

  onSubmit() {
    this
      .feedsService
      .moveCampusWallThreadToChannel(this.feed.id, this.form.value)
      .subscribe(
        _ => {
          $('#moveFeedModal').modal('hide');
          this.moved.emit(this.feed.id);
        });
  }

  ngOnInit() {
    this.schoolId = 157;
    let search = new URLSearchParams();
    search.append('school_id', this.schoolId.toString());

    this.channels$ = this
      .feedsService.getChannelsBySchoolId(1, 1000, search)
      .startWith([{ label: '---' }])
      .map(channels => {
        let _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach(channel => {
          if (this.feed.post_type === channel.id) {
            this.currentChannel = channel.name;
          }
          let _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }
}

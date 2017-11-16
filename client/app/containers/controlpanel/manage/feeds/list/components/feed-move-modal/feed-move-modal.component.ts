import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services/index';

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

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
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
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

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

      this.buttonData = {
        class: 'primary',
        text: this.cpI18n.translate('move'),
        disabled: true
      };

      this.form.valueChanges.subscribe(_ => {
        this.buttonData = Object.assign({}, this.buttonData, { disabled: !this.form.valid });
      })
  }
}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cp-feed-move-modal',
  templateUrl: './feed-move-modal.component.html',
  styleUrls: ['./feed-move-modal.component.scss']
})
export class FeedMoveComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Input() feed: any;
  form: FormGroup;
  channels;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      'channel': [null, Validators.required]
    });
  }

  onSelectedChannel(channel) {
    this.form.controls['channel'].setValue(channel);
  }

  onSubmit() {
    console.log(this.form.value.channel);
  }

  ngOnInit() {
    this.channels = [
      {
        label: 'Dummy Channel',
        action: 1
      },
      {
        label: 'Dummy Channel 2',
        action: 2
      },
      {
        label: 'Dummy Channel 3',
        action: 1
      }
    ];
  }
}

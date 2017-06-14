import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';

declare var $: any;

@Component({
  selector: 'cp-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class EventsFeedbackModalComponent implements OnInit {
  @Input() attendee: any;
  @Output() resetModal: EventEmitter<null> = new EventEmitter();
  listStarSize = STAR_SIZE.SMALL;

  constructor() { }

  doModalReset() {
    this.attendee = null;
    this.resetModal.emit();
    $('#eventFeedbackModal').modal('hide');
  }

  ngOnInit() {
    // console.log(this);
  }
}

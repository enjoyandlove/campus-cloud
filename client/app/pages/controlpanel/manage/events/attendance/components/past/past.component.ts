import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';

interface IState {
  sort_field: string;
  sort_direction: string;
  search_text: string;
}

const state = {
  sort_field: 'name',
  sort_direction: 'asc',
  search_text: null
};

@Component({
  selector: 'cp-attendance-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.scss']
})
export class AttendancePastComponent implements OnInit {
  @Input() event: any;
  @Input() attendees: any;
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  attendeeFeedback;
  state: IState = state;
  listStarSize = STAR_SIZE.DEFAULT;
  detailStarSize = STAR_SIZE.LARGE;

  constructor() { }

  onViewFeedback(attendee): void {
    attendee = Object.assign(
      {},
      attendee,
      { maxRate: this.event.rating_scale_maximum });

    this.attendeeFeedback = attendee;
  }

  doSearch(search_text) {
    this.state = Object.assign({}, this.state, { search_text });

    this.listAction.emit(this.state);
  }

  onResetModal(): void {
    this.attendeeFeedback = null;
  }

  ngOnInit() {
    // console.log(this.attendees);
  }
}

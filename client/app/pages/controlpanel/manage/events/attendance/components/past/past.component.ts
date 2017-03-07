import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { generateExcelFile } from './excel';
import { EventsService } from '../../../events.service';
import { BaseComponent } from '../../../../../../../base/base.component';
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
export class AttendancePastComponent extends BaseComponent implements OnInit {
  @Input() event: any;
  loading;
  attendees;
  attendeeFeedback;
  state: IState = state;
  listStarSize = STAR_SIZE.DEFAULT;
  detailStarSize = STAR_SIZE.LARGE;

  constructor(
    private eventService: EventsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('event_id', this.event.id);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('search_text', this.state.search_text);

    const stream$ = this.eventService.getEventAttendanceByEventId(search);

    super
      .fetchData(stream$)
      .then(res => this.attendees = res )
      .catch(err => console.error(err));
  }

  doSort(sort_field) {
    this.state = Object.assign(
      {},
      this.state,
      { sort_field,
        sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
      }
    );
    this.fetch();
  }

  onCreateExcel() {
    generateExcelFile(this.attendees);
  }

  onViewFeedback(attendee): void {
    attendee = Object.assign(
      {},
      attendee,
      { maxRate: this.event.rating_scale_maximum });

    this.attendeeFeedback = attendee;
  }

  doSearch(search_text): void {
    search_text = search_text === '' ? null : search_text;
    this.state = Object.assign({}, this.state, { search_text });
    this.fetch();
  }

  onResetModal(): void {
    /**
     * in order to clean the stars component
     */
    this.attendeeFeedback = null;
  }

  ngOnInit() {
    this.fetch();
  }
}

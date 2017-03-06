import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { CPDate } from '../../../../../shared/utils/date';
import { BaseComponent } from '../../../../../base/base.component';


@Component({
  selector: 'cp-events-attendance',
  templateUrl: './events-attendance.component.html',
  styleUrls: ['./events-attendance.component.scss']
})
export class EventsAttendanceComponent extends BaseComponent implements OnInit {
  event;
  attendees;
  isUpcoming;
  loading = true;
  eventId: number;
  search: URLSearchParams = new URLSearchParams();

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private isUpcomingEvent(startDate) {
    return startDate > CPDate.toEpoch(new Date());
  }

  private fetch() {
    const event$ = this
      .service
      .getEventById(this.eventId)
      .switchMap(
      res => {
        this.event = res;
        this.buildHeader(res);
        this.isUpcoming = this.isUpcomingEvent(this.event.start);
        this.search.append('event_id', (this.eventId).toString());
        return this.service.getEventAttendanceByEventId(this.search);
      }
      );
    super
      .fetchData(event$)
      .then(res => this.attendees = res)
      .catch(err => console.error(err));
  }

  doSearch(terms) {
    this.search.append('search_text', terms.search_text);
    this.fetch();
    // console.log(terms);
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.title,
        'subheading': '',
        'children': [
          {
            'label': 'Attendance',
            'url': `/manage/events/${this.eventId}`
          },
          {
            'label': 'Info',
            'url': `/manage/events/${this.eventId}/info`
          }
        ]
      }
    });
  }

  ngOnInit() {

  }
}

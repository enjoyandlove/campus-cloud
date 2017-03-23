import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { EventDate } from '../utils';
import { EventsService } from '../events.service';
import { CPDate } from '../../../../../shared/utils/date';
import { BaseComponent } from '../../../../../base/base.component';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';


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

  private isEventOver(endDate) {
    return endDate > CPDate.toEpoch(new Date());
  }

  private fetch() {
    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res.data;
        this.buildHeader(res.data);
        this.isUpcoming = this.isEventOver(this.event.end);
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
    console.log(res);
    let children;

    if (EventDate.isPastEvent(res.end)) {
      if (res.event_attendance === 1) {
        children = [
          {
            'label': 'Attendance',
            'url': `/manage/events/${this.eventId}`
          },
          {
            'label': 'Info',
            'url': `/manage/events/${this.eventId}/info`
          }
        ];
      } else {
        children = [];
      }
    } else {
      children = [
        {
          'label': res.event_attendance === 1 ? 'Attendance' : 'Event',
          'url': `/manage/events/${this.eventId}`
        },
        {
          'label': 'Info',
          'url': `/manage/events/${this.eventId}/info`
        }
      ];
    }


    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.title,
        'subheading': '',
        'children': [...children]
      }
    });
  }

  ngOnInit() { }
}

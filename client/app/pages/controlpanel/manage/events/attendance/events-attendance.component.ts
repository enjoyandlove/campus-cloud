import { Component, OnInit, Input } from '@angular/core';
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
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;

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
            'url': `${this.buildUrlPrefix()}/${this.eventId}`
          },
          {
            'label': 'Info',
            'url': `${this.buildUrlPrefix()}/${this.eventId}/info`
          }
        ];
      } else {
        children = [];
      }
    } else {
      children = [
        {
          'label': res.event_attendance === 1 ? 'Attendance' : 'Event',
          'url': `${this.buildUrlPrefix()}/${this.eventId}`
        },
        {
          'label': 'Info',
          'url': `${this.buildUrlPrefix()}/${this.eventId}/info`
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

   buildUrlPrefix() {
     if (this.isClub) {
       return `/manage/clubs/${this.clubId}/events`;
     } else if (this.isService) {
      return `/manage/services/${this.serviceId}/events`;
     }
     return '/manage/events';
   }

  ngOnInit() { }
}

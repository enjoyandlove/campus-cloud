import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventDate } from '../utils';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent extends BaseComponent implements OnInit {
  event;
  dateFormat;
  mapCenter;
  loading = true;
  eventId: number;
  isEventOver = EventDate.isPastEvent;

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res.data;
        this.buildHeader(res.data);
        this.mapCenter = { lat: res.data.latitude, lng: res.data.longitude };
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
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

  ngOnInit() {

  }
}

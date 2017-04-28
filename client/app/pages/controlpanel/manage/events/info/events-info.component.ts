import { Component, OnInit, Input } from '@angular/core';
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
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;

  event;
  dateFormat;
  mapCenter;
  loading = true;
  eventId: number;
  isPastEvent = EventDate.isPastEvent;

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

  ngOnInit() {

  }
}

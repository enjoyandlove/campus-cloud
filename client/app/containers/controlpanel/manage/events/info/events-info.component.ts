import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventDate } from '../utils';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date';
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
  loading = true;
  eventId: number;
  mapCenter: BehaviorSubject<any>;
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
        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data.latitude,
            lng: res.data.longitude
          }
        );
      })
      .catch(err => { throw new Error(err) });
  }

  private buildHeader(res) {
    let children;

    if (EventDate.isPastEvent(res.end)) {
      if (res.event_attendance === 1) {
        children = [
          {
            'label': 'Info',
            'url': `${this.buildUrlPrefix()}/${this.eventId}/info`
          },
          {
            'label': 'Assessment',
            'url': `${this.buildUrlPrefix()}/${this.eventId}`
          }
        ];
      } else {
        children = [];
      }
    } else {
      children = [
        {
          'label': 'Info',
          'url': `${this.buildUrlPrefix()}/${this.eventId}/info`
        },
        {
          'label': res.event_attendance === 1 ? 'Assessment' : 'Event',
          'url': `${this.buildUrlPrefix()}/${this.eventId}`
        }
      ];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.title,
        'subheading': '',
        'crumbs': {
          'url': 'events',
          'label': 'Events'
        },
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

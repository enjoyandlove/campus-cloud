import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPDate } from '../../../../../shared/utils/date';
import { EventUtilService } from './../events.utils.service';
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
  urlPrefix = this.utils.buildUrlPrefix(this.clubId, this.serviceId);

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService,
    private utils: EventUtilService
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
      .catch(err => { throw new Error(err) });
  }

  private buildHeader(res) {
    let children;

    if (this.utils.isPastEvent(res.end)) {
      if (res.event_attendance === 1) {
        children = [
          {
            'label': 'Info',
            'url': `${this.urlPrefix}/${this.eventId}/info`
          },
          {
            'label': 'Assessment',
            'url': `${this.urlPrefix}/${this.eventId}`
          }
        ];
      } else {
        children = [];
      }
    } else {
      children = [
        // {
        //   'label': 'Info',
        //   'url': `${this.urlPrefix}/${this.eventId}/info`
        // },
        // {
        //   'label': res.event_attendance === 1 ? 'Assessment' : 'Event',
        //   'url': `${this.urlPrefix}/${this.eventId}`
        // }
      ];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.title,
        'subheading': '',
        'crumbs': {
          'url': this.urlPrefix,
          'label': 'Events'
        },
        'children': [...children]
      }
    });
  }

  ngOnInit() { }
}

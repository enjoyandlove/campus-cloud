import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isUpcoming;
  loading = true;
  eventId: number;
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


  private fetch() {
    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(event => {
        this.event = event.data;

        this.buildHeader(event.data);

        this.isUpcoming = this.event.end > CPDate.toEpoch(new Date());
      })
      .catch(err => { throw new Error(err) });
  }

  private buildHeader(event) {
    const children = this.utils.getSubNavChildren(event, this.urlPrefix);

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': event.title,
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

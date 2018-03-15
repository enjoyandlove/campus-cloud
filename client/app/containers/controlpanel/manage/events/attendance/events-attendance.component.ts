import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPDate } from '../../../../../shared/utils/date';
import { EventUtilService } from './../events.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { OrientationService } from '../../orientation/orientation.services';

@Component({
  selector: 'cp-events-attendance',
  templateUrl: './events-attendance.component.html',
  styleUrls: ['./events-attendance.component.scss'],
})
export class EventsAttendanceComponent extends BaseComponent implements OnInit {
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isAthletic: number;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  event;
  service;
  urlPrefix;
  isUpcoming;
  loading = true;
  eventId: number;

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private utils: EventUtilService,
    private eventService: EventsService,
    private orientationService: OrientationService,
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    super.fetchData(this.service.getEventById(this.eventId)).then((event) => {
      this.event = event.data;

      this.buildHeader(event.data);

      this.isUpcoming = this.event.end > CPDate.toEpoch(new Date());
    });
  }

  private buildHeader(event) {
    const children = this.utils.getSubNavChildren(event, this.urlPrefix);

    const payload = {
      heading: `[NOTRANSLATE]${event.title}[NOTRANSLATE]`,

      subheading: '',

      crumbs: {
        url: this.urlPrefix,
        label: 'events',
      },

      children: [...children],
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload,
    });
  }

  ngOnInit() {
    this.service = this.isOrientation ? this.orientationService : this.eventService;

    this.urlPrefix = this.utils.buildUrlPrefix(
      this.clubId,
      this.serviceId,
      this.isAthletic,
      this.orientationId,
    );
    this.fetch();
  }
}

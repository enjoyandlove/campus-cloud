import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from './../../../../../session';
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
  @Input() isAthletic: number;

  event;
  urlPrefix;
  isUpcoming;
  loading = true;
  eventId: number;

  constructor(
    public session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService,
    private utils: EventUtilService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    super.fetchData(this.service.getEventById(this.eventId)).then((event) => {
      this.event = event.data;

      this.buildHeader(event.data);

      this.isUpcoming = this.event.end > CPDate.toEpoch(new Date(), this.session.tz);
    });
  }

  private buildHeader(event) {
    const children = this.utils.getSubNavChildren(event, this.urlPrefix);

    const payload = {
      heading: `[NOTRANSLATE]${event.title}[NOTRANSLATE]`,

      subheading: '',

      crumbs: {
        url: this.urlPrefix,
        label: 'events'
      },

      children: [...children]
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  ngOnInit() {
    this.urlPrefix = this.utils.buildUrlPrefix(this.clubId, this.serviceId, this.isAthletic);
    this.fetch();
  }
}

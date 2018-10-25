/*tslint:disable:max-line-length */
import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { EventAttendance, EventType } from '../event.status';
import { EventUtilService } from './../events.utils.service';
import { CPI18nService } from '../../../../../shared/services';
import { IHeader, baseActions } from '../../../../../store/base';
import { BaseComponent } from '../../../../../base/base.component';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent extends BaseComponent implements OnInit {
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() athleticId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Input() resourceBanner: IResourceBanner;

  event;
  banner;
  urlPrefix;
  dateFormat;
  isPastEvent;
  checkInSource;
  loading = true;
  eventId: number;
  eventCheckinRoute;
  draggable = false;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  attendanceEnabled = EventAttendance.enabled;

  defaultImage = require('public/default/image.png');

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    public service: EventsService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];
  }

  public fetch() {
    super.isLoading().subscribe((res) => (this.loading = res));

    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    super.fetchData(this.service.getEventById(this.eventId, search)).then((event) => {
      this.event = event.data;

      this.isPastEvent = this.utils.isPastEvent(this.event);

      this.urlPrefix = this.utils.buildUrlPrefix(this.getEventType());

      this.banner =
        this.event.poster_url === '' ? this.event.store_logo_url : this.event.poster_url;

      this.buildHeader(this.event);

      this.showLocationDetails = event.data.latitude !== 0 && event.data.longitude !== 0;

      this.mapCenter = new BehaviorSubject({
        lat: event.data.latitude,
        lng: event.data.longitude
      });

      this.resourceBanner = {
        image: this.banner,
        heading: this.event.title,
        subheading: this.event.store_name
      };
    });
  }

  public buildHeader(event) {
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
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  trackCheckinEvent(source_id) {
    const eventProperties = {
      source_id,
      check_in_source: amplitudeEvents.INFO_PAGE,
      check_in_type: this.checkInSource.check_in_type,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CLICKED_WEB_CHECK_IN,
      eventProperties
    );
  }

  getEventType() {
    if (this.isAthletic) {
      return {
        event_type_id: this.clubId,
        event_type: EventType.athletics
      };

    } else if (this.isClub) {
      return {
        event_type_id: this.clubId,
        event_type: EventType.club
      };

    } else if (this.isService) {
      return {
        event_type_id: this.serviceId,
        event_type: EventType.services
      };

    } else if (this.isOrientation) {
      return {
        event_type_id: this.orientationId,
        event_type: EventType.orientation
      };
    } else {
      return { event_type: EventType.event };
    }
  }

  ngOnInit() {
    this.checkInSource = this.utils.getCheckinSourcePage(this.getEventType());

    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);

    this.fetch();
  }
}

/*tslint:disable:max-line-length */
import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { EventAttendance } from '../event.status';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { EventUtilService } from './../events.utils.service';
import { IHeader, baseActions } from '../../../../../store/base';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, RouteLevel } from '../../../../../shared/services';
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
  eventData;
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
    public service: EventsService,
    public cpTracking: CPTrackingService
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

      this.urlPrefix = this.utils.buildUrlPrefix(
        this.clubId,
        this.serviceId,
        this.athleticId,
        this.orientationId
      );

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

  ngOnInit() {
    this.checkInSource = this.utils.getCheckinSourcePage(
      this.isAthletic,
      this.isService,
      this.isClub,
      this.isOrientation
    );

    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };

    this.fetch();
  }
}

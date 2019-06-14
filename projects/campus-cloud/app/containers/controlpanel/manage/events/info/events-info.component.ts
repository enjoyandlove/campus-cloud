import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { FORMAT } from '@shared/pipes';
import IEvent from '../event.interface';
import { CPSession } from '@app/session';
import { EventsService } from '../events.service';
import { EventAttendance } from '../event.status';
import { amplitudeEvents } from '@shared/constants';
import { IResourceBanner } from '@shared/components';
import { IHeader, baseActions } from '@app/store/base';
import { EventUtilService } from './../events.utils.service';
import { environment } from '@campus-cloud/environments/environment';
import { EventsComponent } from '../list/base/events.component';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { CPI18nService, CPTrackingService, RouteLevel, ModalService } from '@shared/services';

@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent extends EventsComponent implements OnInit {
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
  loading = true;
  eventId: number;
  eventCheckinRoute;
  draggable = false;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  attendanceEnabled = EventAttendance.enabled;

  defaultImage = `${environment.root}public/public/default/image.png`;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    public service: EventsService,
    public modalService: ModalService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service, modalService);
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

  trackCheckinEvent(event: IEvent) {
    const eventProperties = {
      source_id: event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: EventsAmplitudeService.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CC_WEB_CHECK_IN, eventProperties);
  }

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);

    this.fetch();
  }
}

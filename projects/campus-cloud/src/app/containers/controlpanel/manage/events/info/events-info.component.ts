import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import IEvent from '../event.interface';
import { CPSession } from '@campus-cloud/session';
import { EventsService } from '../events.service';
import { EventAttendance } from '../event.status';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { EventUtilService } from './../events.utils.service';
import { EventsComponent } from '../list/base/events.component';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { IResourceBanner } from '@campus-cloud/shared/components';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { IHeader, baseActions, baseActionClass } from '@campus-cloud/store/base';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import {
  RouteLevel,
  ModalService,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent extends EventsComponent implements OnInit, OnDestroy {
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

  defaultImage = `${environment.root}assets/assets/default/image.png`;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    public service: EventsService,
    public modalService: ModalService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service, modalService, store);
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];
  }

  public fetch() {
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.loading = res));

    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    super.fetchData(this.service.getEventById(this.eventId, search)).then(
      (event) => {
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
      },
      () => this.handleError()
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
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

  ngOnDestroy() {
    this.emitDestroy();
  }
}

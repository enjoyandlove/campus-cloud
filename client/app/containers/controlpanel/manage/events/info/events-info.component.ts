/*tslint:disable:max-line-length */
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { EventUtilService } from './../events.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from '../../../../../shared/services/index';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss'],
})
export class EventsInfoComponent extends BaseComponent implements OnInit {
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isAthletic: number;
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
  draggable = false;
  mapCenter: BehaviorSubject<any>;

  defaultImage = require('public/default/image.png');

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    public service: EventsService,
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];
  }

  public fetch() {
    super.isLoading().subscribe((res) => (this.loading = res));

    const search = new URLSearchParams();
    if (this.orientationId) {
      search.append('school_id', this.session.g.get('school').id);
      search.append('calendar_id', this.orientationId.toString());
    }

    super.fetchData(this.service.getEventById(this.eventId, search)).then((event) => {
      this.event = event.data;

      this.isPastEvent = this.utils.isPastEvent(this.event);

      this.urlPrefix = this.utils.buildUrlPrefix(
        this.clubId,
        this.serviceId,
        this.isAthletic,
        this.orientationId,
      );

      this.banner =
        this.event.poster_url === ''
          ? this.event.store_logo_url
          : this.event.poster_url;

      this.buildHeader(this.event);

      this.mapCenter = new BehaviorSubject({
        lat: event.data.latitude,
        lng: event.data.longitude,
      });

      this.resourceBanner = {
        image: this.banner,
        heading: this.event.title,
        subheading: this.event.store_name,
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
    this.fetch();
  }
}

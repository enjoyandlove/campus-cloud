/*tslint:disable:max-line-length */

import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date';
import { EventUtilService } from './../events.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from '../../../../../shared/services/index';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';
import { OrientationService } from '../../orientation/orientation.services';

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
  service;
  urlPrefix;
  dateFormat;
  isPastEvent;
  loading = true;
  eventId: number;
  draggable = false;
  mapCenter: BehaviorSubject<any>;

  defaultImage = require('public/default/image.png');

  constructor(
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    private eventService: EventsService,
    private orientationService: OrientationService,
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];
  }

  private fetch() {
    super.isLoading().subscribe((res) => (this.loading = res));

    super.fetchData(this.service.getEventById(this.eventId)).then((event) => {
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
    this.fetch();
  }
}

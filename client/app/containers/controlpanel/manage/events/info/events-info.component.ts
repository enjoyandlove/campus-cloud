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
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService,
    public utils: EventUtilService,
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
  }

  private fetch() {
    super.isLoading().subscribe((res) => (this.loading = res));

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then((event) => {
        this.event = event.data;

        this.isPastEvent = this.utils.isPastEvent(this.event);

        this.urlPrefix = this.utils.buildUrlPrefix(this.clubId, this.serviceId);

        this.banner =
          this.event.poster_url === ''
            ? this.event.store_logo_url
            : this.event.poster_url;

        this.buildHeader(this.event);

        this.mapCenter = new BehaviorSubject({
          lat: event.data.latitude,
          lng: event.data.longitude,
        });
      })
      .catch((err) => {
        throw new Error(err);
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

  ngOnInit() {}
}

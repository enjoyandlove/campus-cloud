/*tslint:disable:max-line-length */
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { DateStatus, DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from '../../../../../shared/services/index';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { CPTrackingService, RouteLevel } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-deals-info',
  templateUrl: './deals-info.component.html',
  styleUrls: ['./deals-info.component.scss']
})
export class DealsInfoComponent extends BaseComponent implements OnInit {
  deal;
  dealId;
  loading;
  forever;
  eventData;
  dateFormat;
  hasMetaData;
  draggable = false;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  resourceBanner: IResourceBanner;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public service: DealsService,
    public cpTracking: CPTrackingService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.dealId = this.route.snapshot.params['dealId'];
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  public fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getDealById(this.dealId, search)).then((deal) => {
      this.deal = deal.data;

      this.buildHeader(this.deal);

      this.showLocationDetails = this.deal.store_latitude !== 0 && this.deal.store_longitude !== 0;

      this.mapCenter = new BehaviorSubject({
        lat: this.deal.store_latitude,
        lng: this.deal.store_longitude
      });

      this.resourceBanner = {
        image: this.deal.image_url,
        heading: this.deal.title,
        subheading: this.deal.store_name
      };

      this.hasMetaData =
        this.deal.start || this.deal.store_address || this.deal.expiration !== this.forever;
    });
  }

  public buildHeader(deal) {
    const payload = {
      heading: `[NOTRANSLATE]${deal.title}[NOTRANSLATE]`,
      subheading: '',
      crumbs: {
        url: 'deals',
        label: 'deals'
      },
      children: []
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  ngOnInit() {
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
    this.forever = DateStatus.forever;
  }
}

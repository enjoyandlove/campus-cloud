import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { DateStatus, DealsService } from '../deals.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { IHeader, baseActions } from '@campus-cloud/store/base';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { IResourceBanner } from '@campus-cloud/shared/components';

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
    public service: DealsService
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
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  ngOnInit() {
    this.fetch();
    this.forever = DateStatus.forever;
  }
}

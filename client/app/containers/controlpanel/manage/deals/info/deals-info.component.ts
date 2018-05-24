/*tslint:disable:max-line-length */
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nService } from '../../../../../shared/services/index';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-deals-info',
  templateUrl: './deals-info.component.html',
  styleUrls: ['./deals-info.component.scss']
})
export class DealsInfoComponent extends BaseComponent implements OnInit {
  deal;
  dealId;
  loading;
  dateFormat;
  draggable = false;
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
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    super.fetchData(this.service.getDealById(this.dealId, search)).then((deal) => {
      this.deal = deal.data;

     /* this.buildHeader(this.deal);

      this.mapCenter = new BehaviorSubject({
        lat: this.deal.store_latitude,
        lng: this.deal.store_longitude
      });

      this.resourceBanner = {
        image: this.deal.image_url,
        heading: this.deal.title,
        subheading: this.deal.store_name
      };*/
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
    this.fetch();
  }
}

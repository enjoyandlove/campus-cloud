import { ServicesService } from './../../../services.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ProvidersService } from '../../../providers.service';
import { BaseComponent } from '../../../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';
import { HEADER_UPDATE, IHeader } from '../../../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ServicesProviderDetailsComponent extends BaseComponent implements OnInit {
  loading;
  provider;
  serviceId;
  providerId;
  MAX_RATE = 5;
  eventRating;
  serviceName: string;
  starSize = STAR_SIZE.LARGE;
  query$: BehaviorSubject<string> = new BehaviorSubject(null);
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private serviceService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.providerId = this.route.snapshot.params['providerId'];
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId);

    const service$ = this.serviceService.getServiceById(this.serviceId)
    const providers$ = this.providersService.getProviderByProviderId(this.providerId, search);

    const stream$ = service$.
      switchMap(service => {
        this.serviceName = service.name;
        return providers$
      });

    super
      .fetchData(stream$)
      .then(res => {
        this.provider = res.data;
        this.eventRating = ((this.provider.avg_rating_percent * this.MAX_RATE) / 100).toFixed(1);

        this.buildHeader();
      })
      .catch(err => { throw new Error(err) });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': `[NOTRANSLATE]${this.provider.provider_name}[NOTRANSLATE]`,
        'crumbs': {
          'url': `services/${this.serviceId}`,
          'label': `[NOTRANSLATE]${this.serviceName}[NOTRANSLATE]`
        },
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  ngOnInit() {
    this.fetch();
  }
}

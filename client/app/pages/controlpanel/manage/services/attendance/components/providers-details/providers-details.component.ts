import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProvidersService } from '../../../providers.service';
import { BaseComponent } from '../../../../../../../base/base.component';
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

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.providerId = this.route.snapshot.params['providerId'];
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId);

    const stream$ = this.providersService.getProviderByProviderId(this.providerId, search);
    super
      .fetchData(stream$)
      .then(res => {
        this.provider = res.data;
        this.buildHeader();
      })
      .catch(err => console.error(err));
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': this.provider.provider_name,
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  ngOnInit() {
  }
}

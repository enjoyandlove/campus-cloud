import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
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
  query$: BehaviorSubject<string> = new BehaviorSubject(null);
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
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

    const stream$ = this.providersService.getProviderByProviderId(this.providerId, search);
    super
      .fetchData(stream$)
      .then(res => {
        if (res.data.avg_rating_percent === -1) {
          this.router.navigate(['/manage/services/' + this.serviceId]);
        }

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
    this.fetch();
  }
}

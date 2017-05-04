import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';

@Component({
  selector: 'cp-checkin-service',
  templateUrl: './checkin-service.component.html',
  styleUrls: ['./checkin-service.component.scss']
})
export class CheckinServiceComponent extends BaseComponent implements OnInit {
  loading;
  serviceId: string;
  serviceProviderId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.serviceId = this.route.snapshot.params['service'];
    this.serviceProviderId = this.route.snapshot.params['provider'];
  }
  // cb/checkin/services;service=XeqmohCZNONC05rEcBItaw;provider=rA5myiH9NEpMczvDufnVCw
  fetch() {
    let search: URLSearchParams = new URLSearchParams();
    search.append('service_id', this.serviceId);
    search.append('provider_id', this.serviceProviderId);

    super
      .fetchData(this.checkinService.getServiceData(search))
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  ngOnInit() {
    if (!this.serviceId || !this.serviceProviderId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
    console.log('hello here');

  }
}

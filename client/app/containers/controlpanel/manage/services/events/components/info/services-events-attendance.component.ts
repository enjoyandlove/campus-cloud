import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServicesService } from '../../../services.service';
import { BaseComponent } from '../../../../../../../base/base.component';
@Component({
  selector: 'cp-services-events-attendance',
  templateUrl: './services-events-attendance.component.html',
})
export class ServicesEventsInfoComponent extends BaseComponent implements OnInit {
  loading;
  storeId;
  serviceId;
  isService;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.isService = true;
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.servicesService.getServiceById(this.serviceId))
      .then(res => this.storeId = res.data.store_id)
      .catch(err => { throw new Error(err) });
  }

  ngOnInit() { }
}

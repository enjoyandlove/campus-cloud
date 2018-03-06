import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServicesService } from '../../../services.service';
import { BaseComponent } from '../../../../../../../base/base.component';
@Component({
  selector: 'cp-services-events-excel',
  templateUrl: './services-events-excel.component.html',
})
export class ServicesEventsExcelComponent extends BaseComponent
  implements OnInit {
  loading;
  storeId;
  serviceId;
  isService;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService,
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    super
      .fetchData(this.servicesService.getServiceById(this.serviceId))
      .then((res) => {
        this.storeId = res.data.store_id;
      });
  }

  ngOnInit() {
    this.isService = true;
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }
}

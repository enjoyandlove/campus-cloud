import { Component, OnInit } from '@angular/core';

import { ServicesService } from '../../../../services/services.service';
import { BaseComponent } from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './select-services-modal.component.html',
  styleUrls: ['./select-services-modal.component.scss']
})
export class SelectServicesModalComponent extends BaseComponent implements OnInit {
  loading;
  services;
  selectedServices = [];

  constructor(
    private servicesService: ServicesService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  onCheckedService(service) {
    this.selectedServices.push(service);
    // console.log(service);
  }

  removeSelectedService(service) {
    console.log(service);
  }

  private fetch() {
    super
    .fetchData(this.servicesService.getServices())
    .then(res => {
      this.services = res;
      console.log(res);
    })
    .catch(err => console.log(err));
  }

  onSubmit() {
    console.log('submiting');
  }

  ngOnInit() { }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-services-info',
  templateUrl: './services-info.component.html',
  styleUrls: ['./services-info.component.scss']
})
export class ServicesInfoComponent extends BaseComponent implements OnInit {
  service;
  mapCenter;
  loading = true;
  serviceId: number;

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private serviceService: ServicesService
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.serviceService.getServiceById(this.serviceId))
      .then(res => {
        this.service = res;
        this.buildHeader(res);
        console.log(this.service);
        this.mapCenter = { lat: res.latitude, lng: res.longitude };
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.name,
        'subheading': '',
        'children': [
          {
            'label': 'Attendance',
            'url': `/manage/services/${this.serviceId}`
          },
          {
            'label': 'Events',
            'url': `/manage/services/${this.serviceId}/events`
          },
          {
            'label': 'Info',
            'url': `/manage/services/${this.serviceId}/info`
          }
        ]
      }
    });
  }

  ngOnInit() { }
}

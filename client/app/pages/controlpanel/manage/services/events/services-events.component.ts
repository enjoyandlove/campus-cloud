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
  selector: 'cp-services-events',
  templateUrl: './services-events.component.html',
  styleUrls: ['./services-events.component.scss']
})
export class ServicesEventsComponent extends BaseComponent implements OnInit {
  loading;
  serviceId: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private serviceService: ServicesService
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.serviceService.getServiceById(this.serviceId))
      .then(res => {
        // this.service = res;
        this.buildHeader(res);
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.data.name,
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

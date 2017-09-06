import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { CPSession } from '../../../../../session';
import { ServicesService } from '../services.service';
import { EventsService } from '../../events/events.service';
import { EventsComponent } from '../../events/list/base/events.component';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/utils/privileges';

@Component({
  selector: 'cp-services-events',
  templateUrl: './services-events.component.html',
  styleUrls: ['./services-events.component.scss']
})
export class ServicesEventsComponent extends EventsComponent implements OnInit {
  service;
  loading = true;
  isService = true;
  serviceId: number;
  serviceStoreId;


  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    public eventsService: EventsService,
    private serviceService: ServicesService
  ) {
    super(session, eventsService);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetchServiceData();
  }

  fetchServiceData() {
    this
      .serviceService
      .getServiceById(this.serviceId)
      .subscribe(
        res => {
          this.service = res;
          this.serviceStoreId = this.service.store_id;
          this.buildHeader();
          this.loading = false;
        });
  }

  private buildHeader() {
    let children = [
      {
        'label': 'Info',
        'url': `/manage/services/${this.serviceId}/info`
      }
    ];

    const eventsSchoolLevel = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = this.
      session.canStoreReadAndWriteResource(this.serviceStoreId, CP_PRIVILEGES_MAP.events);

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        'label': 'Events',
        'url': `/manage/services/${this.serviceId}/events`
      }

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      let attendance = {
        'label': 'Assessment',
        'url': `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': this.service.name,
        'subheading': '',
        'children': [...children]
      }
    });
  }

  ngOnInit() {
    // super.fetchData()
  }
}

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

@Component({
  selector: 'cp-services-events',
  templateUrl: './services-events.component.html',
  styleUrls: ['./services-events.component.scss']
})
export class ServicesEventsComponent extends EventsComponent implements OnInit {
  service;
  loading = true;
  serviceId: number;
  isSimple = true;
  isService = true;


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
          this.buildHeader();
          this.loading = false;
        });
  }


  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': this.service.name,
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

  ngOnInit() {
    // super.fetchData()
  }
}

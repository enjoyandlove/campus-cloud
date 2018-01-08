import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';

import { CPSession } from '../../../../../session';
import { ServicesService } from '../services.service';
import { EventsService } from '../../events/events.service';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants';
import { EventsComponent } from '../../events/list/base/events.component';
import { CPI18nService } from '../../../../../shared/services/index';

@Component({
  selector: 'cp-services-events',
  templateUrl: './services-events.component.html',
  styleUrls: ['./services-events.component.scss']
})
export class ServicesEventsComponent extends EventsComponent {
  service;
  loading = true;
  isService = true;
  serviceId: number;
  serviceStoreId;


  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    public eventsService: EventsService,
    private serviceService: ServicesService
  ) {
    super(session, cpI18n, eventsService);
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
        'label': 'info',
        'url': `/manage/services/${this.serviceId}/info`
      }
    ];

    const eventsSchoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = canStoreReadAndWriteResource(this.session.g,
      this.serviceStoreId, CP_PRIVILEGES_MAP.events);

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        'label': 'events',
        'url': `/manage/services/${this.serviceId}/events`
      }

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      const attendance = {
        'label': 'assessment',
        'url': `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': `[NOTRANSLATE]${this.service.name}[NOTRANSLATE]`,
        'subheading': '',
        'crumbs': {
          'url': 'services',
          'label': 'services',
        },
        'children': [...children]
      }
    });
  }
}

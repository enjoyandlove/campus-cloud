import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { ServicesService } from '../services.service';
import { EventsService } from '../../events/events.service';
import { CPI18nService, ModalService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '../services.utils.service';
import { EventsComponent } from '../../events/list/base/events.component';
import { OrientationEventsService } from '../../orientation/events/orientation.events.service';

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
    public modalService: ModalService,
    public eventsService: EventsService,
    private utils: ServicesUtilsService,
    private serviceService: ServicesService,
    public orientationEventService: OrientationEventsService
  ) {
    super(session, cpI18n, eventsService, modalService);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetchServiceData();
  }

  fetchServiceData() {
    this.serviceService.getServiceById(this.serviceId).subscribe((res) => {
      this.service = res;
      this.serviceStoreId = this.service.store_id;
      this.utils.buildServiceHeader(this.service);
      this.loading = false;
    });
  }
}

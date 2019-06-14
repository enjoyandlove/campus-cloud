import { Component, OnInit, Inject } from '@angular/core';

import { IService } from '../service.interface';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { ServicesService } from '../services.service';
import {
  CPTrackingService,
  CPI18nService,
  MODAL_DATA,
  IModal
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-services-delete',
  templateUrl: './services-delete.component.html',
  styleUrls: ['./services-delete.component.scss']
})
export class ServicesDeleteComponent implements OnInit {
  eventProperties;
  service: IService;
  deleteWarnings = [
    this.cpI18n.translate('t_shared_delete_resource_warning_wall_posts'),
    this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data'),
    this.cpI18n.translate('t_shared_delete_resource_warning_events'),
    this.cpI18n.translate('t_shared_delete_resource_warning_service_providers')
  ];

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    public servicesService: ServicesService
  ) {}

  onClose() {
    this.modal.onClose();
  }

  onDelete() {
    this.servicesService.deleteService(this.service.id).subscribe((_) => {
      this.trackEvent();
      this.modal.onClose(this.service.id);
    });
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {
    this.service = this.modal.data;
  }
}

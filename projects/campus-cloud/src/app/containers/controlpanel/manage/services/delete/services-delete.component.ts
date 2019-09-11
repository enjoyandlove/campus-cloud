import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { IService } from '../service.interface';
import { ISnackbar } from '@campus-cloud/store';
import { ServicesService } from '../services.service';
import { baseActionClass } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import {
  IModal,
  MODAL_DATA,
  CPI18nService,
  CPTrackingService
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
    private store: Store<ISnackbar>,
    private cpTracking: CPTrackingService,
    public servicesService: ServicesService
  ) {}

  onClose() {
    this.modal.onClose();
  }

  onDelete() {
    this.servicesService.deleteService(this.service.id).subscribe(
      () => {
        this.trackEvent();
        this.modal.onClose(this.service.id);
      },
      () => {
        this.onClose();
        this.handleError();
      }
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
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

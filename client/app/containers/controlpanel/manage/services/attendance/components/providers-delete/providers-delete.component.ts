import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ProvidersService } from '../../../providers.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-providers-delete',
  templateUrl: './providers-delete.component.html',
  styleUrls: ['./providers-delete.component.scss']
})
export class ServicesProviderDeleteComponent {
  @Input() provider: any;
  @Input() serviceId: number;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  eventProperties = {
    visits: null,
    ratings: null,
    service_id: null,
    service_provider_id: null
  };

  constructor(
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
    ) {}

  onDelete() {
    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.deleteProvider(this.provider.id, search).subscribe((_) => {
      this.trackEvent(this.provider);
      $('#deleteProvider').modal('hide');
      this.deleted.emit(this.provider.id);
    });
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setServiceProviderEventProperties(data)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_SERVICE_PROVIDER,
      this.eventProperties);
  }
}

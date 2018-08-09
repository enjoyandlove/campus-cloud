import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ProvidersService } from '../../../providers.service';
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

  eventProperties;

  constructor(
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
  ) {}

  onDelete() {
    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.deleteProvider(this.provider.id, search).subscribe((_) => {
      this.trackEvent();
      $('#deleteProvider').modal('hide');
      this.deleted.emit(this.provider.id);
    });
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.ASSESSMENT
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.eventProperties
    );
  }
}

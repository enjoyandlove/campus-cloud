import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-qr-delete',
  templateUrl: './qr-delete.component.html',
  styleUrls: ['./qr-delete.component.scss']
})
export class QrDeleteComponent {
  @Input() provider: any;
  @Input() serviceId: number;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(private cpTracking: CPTrackingService, private providersService: ProvidersService) {}

  onDelete() {
    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.deleteProvider(this.provider.id, search).subscribe((_) => {
      this.trackEvent();
      $('#deleteProvider').modal('hide');
      this.deleted.emit(this.provider.id);
    });
  }

  trackEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }
}

/*tslint:disable:max-line-length*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CheckInMethod } from '../../../../../../events/event.status';
import { CPI18nService } from '../../../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../../../shared/directives/tracking/tracking.directive';

interface IDateRange {
  end: number;
  start: number;
  label: string;
}

@Component({
  selector: 'cp-providers-attendees-action-box',
  templateUrl: './providers-attendees-action-box.component.html',
  styleUrls: ['./providers-attendees-action-box.component.scss']
})
export class ServicesProvidersAttendeesActionBoxComponent implements OnInit {
  @Input() provider;
  @Input() noAttendees;
  @Input() updateQrCode = new BehaviorSubject(null);

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() addCheckIn: EventEmitter<null> = new EventEmitter();
  @Output() onToggleQr: EventEmitter<boolean> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();

  hasQr;
  qrLabel;
  eventData;

  constructor(public cpI18n: CPI18nService) {}

  onDownload() {
    this.download.emit();
  }

  onAddCheckIn() {
    this.addCheckIn.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onEnableDisableQR() {
    this.onToggleQr.emit(this.hasQr);
  }

  onDateChange(dateRange: IDateRange) {
    this.filterByDates.emit(dateRange);
  }

  trackCheckinEvent() {
    const eventProperties = {
      source_id: this.provider.encrypted_id,
      sub_menu_name: amplitudeEvents.SERVICES,
      assessment_type: amplitudeEvents.SERVICE_PROVIDER
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.MANAGE_CC_WEB_CHECK_IN,
      eventProperties
    };
  }

  ngOnInit() {
    this.trackCheckinEvent();

    this.updateQrCode.subscribe((checkInMethods) => {
      this.hasQr = checkInMethods.includes(CheckInMethod.app);
      this.qrLabel = this.hasQr
        ? this.cpI18n.translate('t_services_assessment_disable_qr_check_in')
        : this.cpI18n.translate('t_services_assessment_enable_qr_check_in');
    });
  }
}

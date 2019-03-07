/*tslint:disable:max-line-length*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';
import { CP_TRACK_TO } from '@shared/directives/tracking/tracking.directive';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';

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
  @Input() hasAttendees: boolean;
  @Input() provider: IServiceProvider;
  @Input() updateQrCode = new BehaviorSubject(null);

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() addCheckIn: EventEmitter<null> = new EventEmitter();
  @Output() onToggleQr: EventEmitter<boolean> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  @Output() updateStudentFilter: EventEmitter<EngageUtils.IStudentFilter> = new EventEmitter();

  eventData;
  hasQr: boolean;
  qrLabel: string;
  studentFilter$: Observable<any[]>;
  dateRanges: EngageUtils.IDateFilter[];

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public engageService: EngagementService,
    public engageUtils: EngageUtils.EngagementUtilsService
  ) {}

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

  onStudentFilter(filter: EngageUtils.IStudentFilter) {
    this.updateStudentFilter.emit(filter);
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

    this.studentFilter$ = this.engageUtils.getStudentFilter();
    this.dateRanges = this.engageUtils.dateFilter();
  }
}

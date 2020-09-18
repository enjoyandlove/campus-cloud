import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

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
  @Output() toggleQr: EventEmitter<boolean> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  @Output() updateStudentFilter: EventEmitter<EngageUtils.IStudentFilter> = new EventEmitter();

  eventData;
  hasQr: boolean;
  qrLabel: string;
  studentFilter$: Observable<any[]>;
  dateRanges: EngageUtils.IDateFilter[];

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nPipe,
    public engageUtils: EngageUtils.EngagementUtilsService,
    private eventUtilService: EventUtilService
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
    this.toggleQr.emit(this.hasQr);
  }

  onDateChange(dateRange) {
    if (dateRange.payload) {
      dateRange = {
        label: dateRange.label,
        start: dateRange.payload.range.start,
        end: dateRange.payload.range.end
      };
    }
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
      eventName: amplitudeEvents.MANAGE_CC_KIOSK_CHECK_IN,
      eventProperties
    };
  }

  ngOnInit() {
    this.trackCheckinEvent();

    this.updateQrCode.subscribe((checkInMethods) => {
      this.hasQr = checkInMethods.includes(CheckInMethod.app);
      this.qrLabel = this.hasQr
        ? this.cpI18n.transform('t_services_assessment_disable_qr_check_in')
        : this.cpI18n.transform('t_services_assessment_enable_qr_check_in');
    });

    this.studentFilter$ = this.engageUtils.getStudentFilter();
    this.dateRanges = this.engageUtils.dateFilter();
  }

  displaySelfCheckInLink({ checkin_verification_methods }) {
    return this.eventUtilService.displaySelfCheckInLink({
      attend_verification_methods: checkin_verification_methods
    });
  }
}

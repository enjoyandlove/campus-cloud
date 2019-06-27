import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TooltipOption } from 'bootstrap';

import { CPSession } from '@campus-cloud/session';
import IEvent from '../../../event.interface';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CheckInMethod } from '../../../event.status';
import { EventUtilService } from '../../../events.utils.service';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants/privileges';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils/privileges/privileges';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';

@Component({
  selector: 'cp-events-attendance-action-box',
  templateUrl: './events-attendance-action-box.component.html',
  styleUrls: ['./events-attendance-action-box.component.scss']
})
export class EventsAttendanceActionBoxComponent implements OnInit {
  @Input() event: IEvent;
  @Input() isOrientation: boolean;
  @Input() updateQrCode = new BehaviorSubject(null);
  @Input() totalAttendees = new BehaviorSubject(null);

  @Output() addCheckIn: EventEmitter<null> = new EventEmitter();
  @Output() createExcel: EventEmitter<null> = new EventEmitter();
  @Output() sendMessage: EventEmitter<null> = new EventEmitter();
  @Output() onToggleQr: EventEmitter<boolean> = new EventEmitter();
  @Output() querySearch: EventEmitter<string> = new EventEmitter();
  @Output() trackClickCheckIn: EventEmitter<IEvent> = new EventEmitter();
  @Output() updateStudentFilter: EventEmitter<EngageUtils.IStudentFilter> = new EventEmitter();

  hasQr: boolean;
  qrLabel: string;
  canMessage: boolean;
  canDownload: boolean;
  eventCheckinRoute: string;
  studentFilter$: Observable<any[]>;
  disableMessageAttendees: boolean;
  messageAttendeesTooltipText: string;
  tooltipOptions: TooltipOption = {
    placement: 'left'
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
    public engageService: EngagementService,
    public engageUtils: EngageUtils.EngagementUtilsService
  ) {}

  onSearch(query) {
    this.querySearch.emit(query);
  }

  downloadExcel() {
    this.createExcel.emit();
  }

  sendAttendeesMessage() {
    if (this.disableMessageAttendees) {
      return;
    }

    this.sendMessage.emit();
  }

  onAddCheckIn() {
    this.addCheckIn.emit();
  }

  onEnableDisableQR() {
    this.onToggleQr.emit(this.hasQr);
  }

  getStudentIds(attendees) {
    if (attendees && attendees instanceof Array) {
      return attendees.filter((attendee) => attendee.user_id).map((attendee) => attendee.user_id)
        .length;
    }
  }

  onStudentFilter(filter) {
    this.updateStudentFilter.emit(filter);
  }

  ngOnInit() {
    this.canMessage = canSchoolWriteResource(
      this.session.g,
      CP_PRIVILEGES_MAP.campus_announcements
    );

    this.canDownload = this.session.canAttendance(this.event.store_id);

    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);

    this.updateQrCode.subscribe((checkInMethods) => {
      this.hasQr = checkInMethods.includes(CheckInMethod.app);
      this.qrLabel = this.hasQr
        ? this.cpI18n.translate('t_events_assessment_disable_qr_check_in')
        : this.cpI18n.translate('t_events_assessment_enable_qr_check_in');
    });

    this.totalAttendees.subscribe((attendees) => {
      this.disableMessageAttendees = !this.canMessage || !this.getStudentIds(attendees);

      if (!this.canMessage) {
        this.messageAttendeesTooltipText = this.cpI18n.translate(
          't_events_attendance_no_permission_tooltip_text'
        );
      } else if (!this.getStudentIds(attendees)) {
        this.messageAttendeesTooltipText = this.cpI18n.translate(
          't_events_attendance_no_students_tooltip_text'
        );
      } else {
        this.messageAttendeesTooltipText = '';
      }
    });

    this.studentFilter$ = this.engageUtils.getStudentFilter();
  }
}

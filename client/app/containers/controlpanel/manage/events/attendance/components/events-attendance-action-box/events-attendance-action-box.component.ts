/*tslint:disable:max-line-length*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

import { CPSession } from './../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants/privileges';
import { canSchoolWriteResource } from './../../../../../../../shared/utils/privileges/privileges';

@Component({
  selector: 'cp-events-attendance-action-box',
  templateUrl: './events-attendance-action-box.component.html',
  styleUrls: ['./events-attendance-action-box.component.scss']
})
export class EventsAttendanceActionBoxComponent implements OnInit {
  @Input() event: any;
  @Input() totalAttendees = new BehaviorSubject(null);
  @Input() isOrientation: boolean;

  @Output() querySearch: EventEmitter<string> = new EventEmitter();
  @Output() createExcel: EventEmitter<null> = new EventEmitter();
  @Output() sendMessage: EventEmitter<null> = new EventEmitter();

  eventCheckinRoute;
  disableMessageAttendees;
  messageAttendeesTooltipText;
  canDownload = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.event_attendance);
  canMessage = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements);

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: EventUtilService
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

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);

    this.totalAttendees.subscribe((attendees) => {
      this.disableMessageAttendees = !this.canMessage || !attendees;
      if (!attendees) {
        this.messageAttendeesTooltipText = this.cpI18n.translate('t_events_attendance_no_attendees_tooltip_text');
      } else if (!this.canMessage) {
        this.messageAttendeesTooltipText = this.cpI18n.translate('t_events_attendance_no_permission_tooltip_text');
      } else {
        this.messageAttendeesTooltipText = '';
      }
    });

  }
}

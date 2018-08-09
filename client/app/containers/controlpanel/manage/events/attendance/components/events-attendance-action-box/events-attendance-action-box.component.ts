import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Input() attendees: any;
  @Input() isOrientation: boolean;

  @Output() querySearch: EventEmitter<string> = new EventEmitter();
  @Output() createExcel: EventEmitter<null> = new EventEmitter();
  @Output() sendMessage: EventEmitter<null> = new EventEmitter();

  disabled;
  eventCheckinRoute;
  tooltipContent = '';
  hasPermission = false;

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
    if (this.disabled) {
      return;
    }

    this.sendMessage.emit();
  }

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    this.hasPermission = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.event_attendance);

    this.disabled = !this.hasPermission || !this.attendees;

    if (!this.attendees) {
      this.tooltipContent = this.cpI18n.translate('t_events_attendance_no_attendees_tooltip_text');
    } else if (!this.hasPermission) {
      this.tooltipContent = this.cpI18n.translate('t_events_attendance_no_permission_tooltip_text');
    }
  }
}

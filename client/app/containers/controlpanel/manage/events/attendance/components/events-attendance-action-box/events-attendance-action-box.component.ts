import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPSession } from './../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants/privileges';
import { canSchoolWriteResource } from './../../../../../../../shared/utils/privileges/privileges';

@Component({
  selector: 'cp-events-attendance-action-box',
  templateUrl: './events-attendance-action-box.component.html',
  styleUrls: ['./events-attendance-action-box.component.scss']
})
export class EventsAttendanceActionBoxComponent implements OnInit {
  @Input() event: any;
  @Input() isOrientation: boolean;

  @Output() querySearch: EventEmitter<string> = new EventEmitter();
  @Output() createExcel: EventEmitter<null> = new EventEmitter();

  eventCheckinRoute;
  canDownload = false;

  constructor(public session: CPSession, public utils: EventUtilService) {}

  onSearch(query) {
    this.querySearch.emit(query);
  }

  downloadExcel() {
    this.createExcel.emit();
  }

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    this.canDownload = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.event_attendance);
  }
}

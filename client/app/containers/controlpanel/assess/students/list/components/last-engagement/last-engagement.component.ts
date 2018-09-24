import { Component, Input, OnInit } from '@angular/core';

import { IAssessStudent } from '../../../students.interface';
import { FORMAT } from '../../../../../../../shared/pipes/date';

@Component({
  selector: 'cp-student-last-engagement',
  templateUrl: './last-engagement.component.html'
})
export class StudentsLastEngagementComponent implements OnInit {
  @Input() student: IAssessStudent;

  lastEngaged;
  hasEngagement;
  dateFormat = FORMAT.DATETIME;

  getLastEngaged() {
    let lastEvent = this.student.last_event;
    let lastService = this.student.last_service;
    const lastOrientation = this.student.last_orientation_event;

    lastEvent = lastEvent > lastService && lastEvent > lastOrientation ? lastEvent : null;
    lastService = lastService > lastEvent && lastService > lastOrientation ? lastService :  null;

    return lastEvent ? lastEvent : lastService ? lastService : lastOrientation;
  }

  ngOnInit() {
    this.lastEngaged = this.getLastEngaged();

    this.hasEngagement = this.student.last_event
      || this.student.last_service
      || this.student.last_orientation_event;
  }
}

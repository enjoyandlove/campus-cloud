import { Component, OnInit, Input } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes/date.pipe';

@Component({
  selector: 'cp-attendance-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class AttendanceUpcomingComponent implements OnInit {
  @Input() event: any;
  format = FORMAT.DATETIME;

  constructor() { }

  ngOnInit() { }
}

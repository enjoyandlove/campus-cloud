import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FORMAT } from '../../../../../../../shared/pipes/date.pipe';

@Component({
  selector: 'cp-attendance-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class AttendanceUpcomingComponent implements OnInit {
  @Input() event: any;

  mapCenter;
  dateFormat;
  format = FORMAT.DATETIME;

  constructor() { }

  ngOnInit() {
    this.dateFormat = FORMAT.DATETIME;
    this.mapCenter = new BehaviorSubject(
    {
      lat: this.event.latitude,
      lng: this.event.longitude
    }
    );
  }
}

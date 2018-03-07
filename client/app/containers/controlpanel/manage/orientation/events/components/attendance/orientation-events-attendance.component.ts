import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-attendance',
  template: `<cp-events-attendance
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-attendance>`,
})
export class OrientationEventsAttendanceComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

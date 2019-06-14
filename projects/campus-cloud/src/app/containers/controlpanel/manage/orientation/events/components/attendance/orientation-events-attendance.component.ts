import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../events/events.service';
import { OrientationEventsService } from '../../orientation.events.service';

@Component({
  selector: 'cp-orientation-events-attendance',
  template: `
    <cp-events-attendance [isOrientation]="isOrientation" [orientationId]="orientationId">
    </cp-events-attendance>
  `,
  providers: [{ provide: EventsService, useClass: OrientationEventsService }]
})
export class OrientationEventsAttendanceComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

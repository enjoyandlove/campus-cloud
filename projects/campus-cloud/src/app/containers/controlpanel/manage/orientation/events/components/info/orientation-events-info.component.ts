import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../events/events.service';
import { OrientationEventsService } from '../../orientation.events.service';

@Component({
  selector: 'cp-orientation-events-info',
  template: `
    <cp-events-info [isOrientation]="isOrientation" [orientationId]="orientationId">
    </cp-events-info>
  `,
  providers: [{ provide: EventsService, useClass: OrientationEventsService }]
})
export class OrientationEventsInfoComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

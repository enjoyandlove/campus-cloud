import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventsService } from '../../../../events/events.service';
import { OrientationEventsService } from '../../orientation.events.service';

@Component({
  selector: 'cp-orientation-events-edit',
  template: `<cp-events-edit
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-edit>`,
  providers: [{ provide: EventsService, useClass: OrientationEventsService }]
})
export class OrientationEventsEditComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

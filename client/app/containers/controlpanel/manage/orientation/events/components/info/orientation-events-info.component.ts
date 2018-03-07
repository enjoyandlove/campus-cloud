import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-info',
  template: `<cp-events-info
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-info>`,
})
export class OrientationEventsInfoComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-create',
  template: `<cp-events-create
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-create>`,
})
export class OrientationEventsCreateComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

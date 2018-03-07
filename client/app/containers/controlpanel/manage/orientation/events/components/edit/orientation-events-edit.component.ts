import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-edit',
  template: `<cp-events-edit
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-edit>`,
})
export class OrientationEventsEditComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

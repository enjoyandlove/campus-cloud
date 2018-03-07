import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-excel',
  template: `<cp-events-excel
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-excel>`,
})
export class OrientationEventsExcelComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

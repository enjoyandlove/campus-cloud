import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-events-facebook',
  template: `<cp-events-facebook
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events-facebook>`,
})
export class OrientationEventsFacebookComponent implements OnInit {
  isOrientation = true;
  orientationId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
  }
}

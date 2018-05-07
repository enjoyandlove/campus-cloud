import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-wall',
  template: `<cp-feeds
              [orientationId]="orientationId">
             </cp-feeds>`,
})
export class OrientationWallComponent implements OnInit {
  orientationId: number;

  constructor(
    private route: ActivatedRoute
  ) {
    this.orientationId = this.route.parent.snapshot.params['orientationId'];
  }

  ngOnInit() {}
}

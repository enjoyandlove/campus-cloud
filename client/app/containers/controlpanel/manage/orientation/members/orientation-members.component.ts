import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-members',
  template: `<cp-clubs-members
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-clubs-members>`,
})
export class OrientationMembersComponent implements OnInit {
  isOrientation: boolean;
  orientationId: number;

  constructor(private route: ActivatedRoute) {
    this.orientationId = this.route.parent.snapshot.parent.params['orientationId'];
  }

  ngOnInit() {}
}

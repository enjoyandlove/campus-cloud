import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupType } from '../../feeds/feeds.utils.service';

@Component({
  selector: 'cp-orientation-wall',
  template: `
    <cp-feeds [groupType]="groupType" hideIntegrations="true" [groupId]="orientationId"> </cp-feeds>
  `
})
export class OrientationWallComponent implements OnInit {
  orientationId: number;
  groupType = GroupType.orientation;

  constructor(private route: ActivatedRoute) {
    this.orientationId = this.route.parent.snapshot.params['orientationId'];
  }

  ngOnInit() {}
}

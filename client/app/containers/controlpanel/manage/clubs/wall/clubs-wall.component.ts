import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupType } from '../../feeds/feeds.utils.service';

@Component({
  selector: 'cp-clubs-wall',
  templateUrl: './clubs-wall.component.html'
})
export class ClubsWallComponent implements OnInit {
  @Input() groupId: number;
  @Input() groupType: GroupType = GroupType.club;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupId = this.route.parent.snapshot.params['clubId'];
  }
}

import { Component, OnInit, Input } from '@angular/core';

import { GroupType } from '../../feeds/feeds.utils.service';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-wall',
  template: `
    <cp-clubs-wall [groupId]="athleticId" [groupType]="groupType"> </cp-clubs-wall>
  `
})
export class AthleticsWallComponent implements OnInit {
  @Input() athleticId = isClubAthletic.athletic;

  groupType = GroupType.athletics;

  constructor() {}

  ngOnInit() {}
}

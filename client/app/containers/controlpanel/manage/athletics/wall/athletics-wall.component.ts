import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-wall',
  template: `<cp-clubs-wall
              [athleticId]="athleticId">
             </cp-clubs-wall>`
})
export class AthleticsWallComponent implements OnInit {
  @Input() athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

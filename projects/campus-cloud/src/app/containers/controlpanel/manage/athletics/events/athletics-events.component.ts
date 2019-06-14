import { Component, OnInit } from '@angular/core';

import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events',
  template: `
    <cp-clubs-events [athleticId]="athleticId" [isAthletic]="isAthletic"> </cp-clubs-events>
  `
})
export class AthleticsEventsComponent implements OnInit {
  isAthletic = true;
  athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

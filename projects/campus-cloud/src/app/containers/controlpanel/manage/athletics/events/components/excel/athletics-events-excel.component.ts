import { Component, OnInit } from '@angular/core';

import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-excel',
  template: `
    <cp-clubs-events-excel [isAthletic]="isAthletic" [athleticId]="athleticId">
    </cp-clubs-events-excel>
  `
})
export class AthleticsEventsExcelComponent implements OnInit {
  isAthletic = true;
  athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

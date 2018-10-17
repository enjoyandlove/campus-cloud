import { Component, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-info',
  template: `<cp-clubs-events-info
              [athleticId]="athleticId"
              [isAthletic]="isAthletic">
             </cp-clubs-events-info>`
})
export class AthleticsEventsInfoComponent implements OnInit {
  isAthletic = true;
  athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

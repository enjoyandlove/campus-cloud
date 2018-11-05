import { Component, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-attendance',
  template: `<cp-clubs-events-attendance
              [athleticId]="athleticId"
              [isAthletic]="isAthletic">
             </cp-clubs-events-attendance>`
})
export class AthleticsEventsAtthendanceComponent implements OnInit {
  isAthletic = true;
  athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

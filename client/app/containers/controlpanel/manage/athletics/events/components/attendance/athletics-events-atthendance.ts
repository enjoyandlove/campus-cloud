import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-attendance',
  template: `<cp-clubs-events-attendance
              [isAthletic]="isAthletic">
             </cp-clubs-events-attendance>`,
})
export class AthleticsEventsAtthendanceComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

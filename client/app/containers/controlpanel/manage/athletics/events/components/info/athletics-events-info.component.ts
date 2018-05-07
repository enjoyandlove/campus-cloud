import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-info',
  template: `<cp-clubs-events-info
              [isAthletic]="isAthletic">
             </cp-clubs-events-info>`,
})
export class AthleticsEventsInfoComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

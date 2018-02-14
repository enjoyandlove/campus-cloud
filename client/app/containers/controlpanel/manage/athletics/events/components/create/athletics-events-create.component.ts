import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-create',
  template: `<cp-clubs-events-create
              [isAthletic]="isAthletic">
             </cp-clubs-events-create>`,
})
export class AthleticsEventsCreateComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

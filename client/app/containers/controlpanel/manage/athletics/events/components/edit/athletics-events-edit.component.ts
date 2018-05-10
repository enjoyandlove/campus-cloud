import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-edit',
  template: `<cp-clubs-events-edit
              [isAthletic]="isAthletic">
             </cp-clubs-events-edit>`
})
export class AthleticsEventsEditComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

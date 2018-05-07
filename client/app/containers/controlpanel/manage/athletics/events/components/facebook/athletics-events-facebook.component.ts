import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-facebook',
  template: `<cp-clubs-events-facebook
              [isAthletic]="isAthletic">
             </cp-clubs-events-facebook>`,
})
export class AthleticsEventsFacebookComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

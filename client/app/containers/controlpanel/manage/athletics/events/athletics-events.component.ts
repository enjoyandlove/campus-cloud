import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events',
  template: `<cp-clubs-events
              [isAthletic]="isAthletic">
             </cp-clubs-events>`
})
export class AthleticsEventsComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

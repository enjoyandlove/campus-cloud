import { Component, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-edit',
  template: `
    <cp-clubs-events-edit [isAthletic]="isAthletic" [athleticId]="athleticId">
    </cp-clubs-events-edit>
  `
})
export class AthleticsEventsEditComponent implements OnInit {
  isAthletic = true;
  athleticId = isClubAthletic.athletic;

  constructor() {}

  ngOnInit() {}
}

import { Component, Input, OnInit } from '@angular/core';
import { isClubAthletic } from '../../../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-events-excel',
  template: `<cp-clubs-events-excel
              [isAthletic]="isAthletic">
             </cp-clubs-events-excel>`
})
export class AthleticsEventsExcelComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

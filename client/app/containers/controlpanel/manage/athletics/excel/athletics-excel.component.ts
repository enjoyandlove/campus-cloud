import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-excel',
  template: `<cp-clubs-excel
              [isAthletic]="isAthletic">
             </cp-clubs-excel>`,
})
export class AthleticsExcelComponent implements OnInit {
  @Input() isAthletic;

  constructor() { }

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

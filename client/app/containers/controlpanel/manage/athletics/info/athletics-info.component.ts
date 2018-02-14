import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-info',
  template: `<cp-clubs-info
              [isAthletic]="isAthletic">
             </cp-clubs-info>`,
})
export class AthleticsInfoComponent implements OnInit {
  @Input() isAthletic;

  constructor() { }

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-list',
  template: `<cp-clubs-list
              [isAthletic]="isAthletic">
             </cp-clubs-list>`
})
export class AthleticsListComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-members',
  template: `<cp-clubs-members
              [isAthletic]="isAthletic">
             </cp-clubs-members>`,
})
export class AthleticsMembersComponent implements OnInit {
  @Input() isAthletic;

  constructor() { }

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

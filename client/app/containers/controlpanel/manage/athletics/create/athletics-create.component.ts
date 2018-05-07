import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-create',
  template: `<cp-clubs-create
              [isAthletic]="isAthletic">
             </cp-clubs-create>`,
})
export class AthleticsCreateComponent implements OnInit {
  @Input() isAthletic;

  constructor() { }

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

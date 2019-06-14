import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-edit',
  template: `
    <cp-clubs-edit [isAthletic]="isAthletic"> </cp-clubs-edit>
  `
})
export class AthleticsEditComponent implements OnInit {
  @Input() isAthletic;

  constructor() {}

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

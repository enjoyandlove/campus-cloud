import { Component, OnInit, Input } from '@angular/core';
import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-delete',
  template: `<cp-clubs-delete
              [isAthletic]="isAthletic">
             </cp-clubs-delete>`,
})
export class AthleticsDeleteComponent implements OnInit {
  @Input() isAthletic;

  constructor() { }

  ngOnInit() {
    this.isAthletic = isClubAthletic.athletic;
  }
}

import { Component } from '@angular/core';

import { isClubAthletic } from '../../clubs/clubs.athletics.labels';

@Component({
  selector: 'cp-athletics-delete',
  template: `<cp-clubs-delete
              [isAthletic]="isAthletic">
             </cp-clubs-delete>`
})
export class AthleticsDeleteComponent {
  isAthletic = isClubAthletic.athletic;

  constructor() {}
}

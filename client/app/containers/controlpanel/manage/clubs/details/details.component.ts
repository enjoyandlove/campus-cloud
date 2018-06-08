import { Component, Input } from '@angular/core';

import { isClubAthletic } from '../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-details',
  template: '<router-outlet></router-outlet>'
})
export class ClubsDetailsComponent {
  @Input() isAthletic = isClubAthletic.club;

  constructor() {}
}

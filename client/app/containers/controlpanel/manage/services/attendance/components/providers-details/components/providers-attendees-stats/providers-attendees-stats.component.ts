import { Component, Input } from '@angular/core';

import { STAR_SIZE } from '../../../../../../../../../shared/components/cp-stars';

@Component({
  selector: 'cp-providers-attendees-stats',
  templateUrl: './providers-attendees-stats.component.html',
  styleUrls: ['./providers-attendees-stats.component.scss']
})
export class ServicesProvidersAttendeesStatsComponent {
  @Input() provider;
  @Input() eventRating;

  MAX_RATE = 5;
  starSize = STAR_SIZE.LARGE;

  constructor() {}
}

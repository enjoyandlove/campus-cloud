import { Component, Input } from '@angular/core';

import { IOpeningHours } from '@libs/locations/common/model';

@Component({
  selector: 'cp-dining-opening-hours',
  templateUrl: './dining-opening-hours.component.html',
  styleUrls: ['./dining-opening-hours.component.scss']
})
export class DiningOpeningHoursComponent {
  @Input() openingHours: IOpeningHours[];
}

import { Component, Input } from '@angular/core';

import { IOpeningHours } from '@campus-cloud/libs/locations/common/model';

@Component({
  selector: 'cp-location-opening-hours',
  templateUrl: './locations-opening-hours.component.html',
  styleUrls: ['./locations-opening-hours.component.scss']
})
export class LocationsOpeningHoursComponent {
  @Input() openingHours: IOpeningHours[];
}

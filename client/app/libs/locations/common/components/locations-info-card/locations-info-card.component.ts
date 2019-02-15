import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ILocation } from '@libs/locations/common/model';

@Component({
  selector: 'cp-locations-info-card',
  templateUrl: './locations-info-card.component.html',
  styleUrls: ['./locations-info-card.component.scss']
})
export class LocationsInfoCardComponent {
  @Input() location: ILocation;
  @Input() mapCenter: BehaviorSubject<any>;
}


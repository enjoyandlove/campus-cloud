import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IResourceBanner } from '@campus-cloud/shared/components';
import { ILocation } from '@campus-cloud/libs/locations/common/model';

@Component({
  selector: 'cp-locations-info-resource-banner',
  templateUrl: './locations-info-resource-banner.component.html',
  styleUrls: ['./locations-info-resource-banner.component.scss']
})
export class LocationsInfoResourceBannerComponent {
  @Input() location: ILocation;
  @Input() resourceBanner: IResourceBanner;

  @Output() editClick: EventEmitter<null> = new EventEmitter();
}

import { Component, Input } from '@angular/core';

import { IDining } from '@libs/locations/common/model';

@Component({
  selector: 'cp-locations-meta-data',
  templateUrl: './locations-meta-data.component.html',
  styleUrls: ['./locations-meta-data.component.scss']
})
export class LocationsMetaDataComponent {
  @Input() dining: IDining;
}

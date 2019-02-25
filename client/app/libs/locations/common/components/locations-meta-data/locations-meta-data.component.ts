import { Component, Input } from '@angular/core';

import { IDining, ILocation } from '@libs/locations/common/model';

@Component({
  selector: 'cp-locations-meta-data',
  templateUrl: './locations-meta-data.component.html',
  styleUrls: ['./locations-meta-data.component.scss']
})
export class LocationsMetaDataComponent {
  @Input() location: IDining | ILocation;

  get hasNotes() {
    return 'notes' in this.location && this.location.notes;
  }
}

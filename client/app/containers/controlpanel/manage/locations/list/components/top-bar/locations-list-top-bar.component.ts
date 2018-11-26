import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-locations-list-top-bar',
  templateUrl: './locations-list-top-bar.component.html',
  styleUrls: ['./locations-list-top-bar.component.scss']
})
export class LocationsListTopBarComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();

  eventData;

  constructor(private cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}

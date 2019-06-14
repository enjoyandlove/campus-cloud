import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CPTrackingService } from '../../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-store-action-box',
  templateUrl: './store-action-box.component.html',
  styleUrls: ['./store-action-box.component.scss']
})
export class StoreActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  eventData;

  constructor(public cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.STORE
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties
    };
  }
}

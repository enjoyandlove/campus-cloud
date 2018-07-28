import { Component, EventEmitter, Output } from '@angular/core';

import { CPTrackingService } from '../../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-employer-action-box',
  templateUrl: './employer-action-box.component.html',
  styleUrls: ['./employer-action-box.component.scss']
})
export class EmployerActionBoxComponent {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  amplitudeEvents;

  constructor(public cpTracking: CPTrackingService) {
    this.amplitudeEvents = {
      clicked_create: amplitudeEvents.CLICKED_CREATE_ITEM
    };
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }
}

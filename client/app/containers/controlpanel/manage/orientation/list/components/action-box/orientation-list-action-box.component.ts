import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-orientation-list-action-box',
  templateUrl: './orientation-list-action-box.component.html',
  styleUrls: ['./orientation-list-action-box.component.scss']
})
export class OrientationListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  amplitudeEvents;

  constructor(public cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties()
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.amplitudeEvents = {
      clicked_create: amplitudeEvents.CLICKED_CREATE_ITEM
    };
  }
}

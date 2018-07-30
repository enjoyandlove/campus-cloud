import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-calendars-details-action-box',
  templateUrl: './calendars-details-action-box.component.html',
  styleUrls: ['./calendars-details-action-box.component.scss']
})
export class CalendarsDetailsActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();

  amplitudeEvents;

  constructor(public cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  launchModal() {
    $('#calendarsItemsImport').modal();
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.CALENDAR_EVENTS
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.amplitudeEvents = {
      clicked_change: amplitudeEvents.CLICKED_CHANGE_BUTTON
    };
  }
}

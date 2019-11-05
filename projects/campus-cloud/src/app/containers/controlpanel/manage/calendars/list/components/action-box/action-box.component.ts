import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-calendars-list-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss']
})
export class CalendarsListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  eventData;

  constructor(private cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}

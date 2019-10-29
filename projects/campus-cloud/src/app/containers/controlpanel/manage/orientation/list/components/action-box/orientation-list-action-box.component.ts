import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CPTrackingService } from '../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-orientation-list-action-box',
  templateUrl: './orientation-list-action-box.component.html',
  styleUrls: ['./orientation-list-action-box.component.scss']
})
export class OrientationListActionBoxComponent implements OnInit {
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
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}

import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CPTrackingService } from '@campus-cloud/shared/services';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';

@Component({
  selector: 'cp-todos-list-action-box',
  templateUrl: './todos-list-action-box.component.html',
  styleUrls: ['./todos-list-action-box.component.scss']
})
export class TodosListActionBoxComponent implements OnInit {
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

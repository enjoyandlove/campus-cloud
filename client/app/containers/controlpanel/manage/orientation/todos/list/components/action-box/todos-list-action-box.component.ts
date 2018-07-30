import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { CPTrackingService } from '../../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-todos-list-action-box',
  templateUrl: './todos-list-action-box.component.html',
  styleUrls: ['./todos-list-action-box.component.scss']
})
export class TodosListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  clicked_change = amplitudeEvents.CLICKED_CHANGE_BUTTON;

  constructor(public cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.TODOS
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {}
}

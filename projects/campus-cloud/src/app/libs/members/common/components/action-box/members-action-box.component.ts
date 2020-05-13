import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

import { CPTrackingService } from '@campus-cloud/shared/services';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';

@Component({
  selector: 'cp-members-action-box',
  templateUrl: './members-action-box.component.html',
  styleUrls: ['./members-action-box.component.scss']
})
export class MembersActionBoxComponent implements OnInit {
  @Input() showCreateButton = true;
  @Input() showDownloadButton = true;

  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();

  eventData;

  constructor(private cpTracking: CPTrackingService) {}

  onSearch(query: string) {
    this.search.emit(query);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}

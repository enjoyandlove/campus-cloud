import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-templates-top-bar',
  templateUrl: './templates-top-bar.component.html',
  styleUrls: ['./templates-top-bar.component.scss']
})
export class TemplatesTopBarComponent implements OnInit {
  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() query: EventEmitter<string> = new EventEmitter();

  eventData;

  constructor(public cpTracking: CPTrackingService) {}

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };
  }
}

import { Component, OnInit } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import * as buildJson from '@projects/campus-cloud/src/assets/build.json';
import { CPTrackingService, RouteLevel } from '@campus-cloud/shared/services';
import { ZendeskService } from '@campus-cloud/shared/services/zendesk.service';

@Component({
  selector: 'cp-help-desk',
  templateUrl: './cp-help-desk.component.html',
  styleUrls: ['./cp-help-desk.component.scss']
})
export class CPHelpDeskComponent implements OnInit {
  helpDeskUrl = ZendeskService.zdRoot();
  lastBuildTime = buildJson.lastBuildTime;

  constructor(private cpTracking: CPTrackingService) {}

  trackHelpDeskAction(information_type) {
    const eventName = amplitudeEvents.VIEWED_INFORMATION;

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth),
      information_type
    };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  ngOnInit() {}
}

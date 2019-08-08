import { Component, OnInit } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import * as buildJson from '@projects/campus-cloud/src/assets/build.json';
import { CPTrackingService, RouteLevel, ZendeskService } from '@campus-cloud/shared/services';

declare var window;

@Component({
  selector: 'cp-help-desk',
  templateUrl: './cp-help-desk.component.html',
  styleUrls: ['./cp-help-desk.component.scss']
})
export class CPHelpDeskComponent implements OnInit {
  helpDeskUrl = ZendeskService.zdRoot();
  lastBuildTime = buildJson.lastBuildTime;

  constructor(private cpTracking: CPTrackingService, private zd: ZendeskService) {}

  trackHelpDeskAction(information_type) {
    const eventName = amplitudeEvents.VIEWED_INFORMATION;

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth),
      information_type
    };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  loadHelpDeskWidget() {
    if (this.zd.loaded) {
      const hostEl: any = document.querySelector('.nav__help-desk');
      const { right, width } = hostEl.getBoundingClientRect();

      window.zE('webWidget', 'updateSettings', {
        webWidget: {
          offset: {
            vertical: '60px',
            horizontal: `${window.innerWidth - right - width / 2}px`
          }
        }
      });

      window.onscroll = () => {
        this.zd.hide();
      };

      window.onresize = () => {
        this.zd.hide();
      };

      this.zd.activate({});
    }
  }

  ngOnInit() {}
}

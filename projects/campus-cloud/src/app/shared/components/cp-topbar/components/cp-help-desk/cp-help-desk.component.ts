import { Component, Input, OnInit } from '@angular/core';

import { EnvService } from '@campus-cloud/config/env';
import { appStorage, base64 } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import * as buildJson from '@projects/campus-cloud/src/assets/build.json';
import { CPTrackingService, ZendeskService } from '@campus-cloud/shared/services';

declare var window;

@Component({
  selector: 'cp-help-desk',
  templateUrl: './cp-help-desk.component.html',
  styleUrls: ['./cp-help-desk.component.scss']
})
export class CPHelpDeskComponent implements OnInit {
  highlight = false;
  helpDeskUrl = ZendeskService.zdRoot();
  lastBuildTime = buildJson.lastBuildTime;

  @Input() releaseId: number;

  constructor(
    private env: EnvService,
    private zd: ZendeskService,
    private cpTracking: CPTrackingService
  ) {}

  trackHelpDeskAction(information_type) {
    this.setWhatsNewCookie();
    const eventName = amplitudeEvents.VIEWED_INFORMATION;

    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
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

  setWhatsNewCookie() {
    this.highlight = false;
    appStorage.set(base64.encode(appStorage.keys.WHATS_NEW), this.releaseId.toString());
  }

  showWhatsNew() {
    const previousChangeLogKey = appStorage.get(base64.encode(appStorage.keys.WHATS_NEW));
    this.highlight = !previousChangeLogKey || previousChangeLogKey !== this.releaseId.toString();
  }

  ngOnInit() {
    // if (this.env.name === 'production') {
    //   this.showWhatsNew();
    // }
  }
}

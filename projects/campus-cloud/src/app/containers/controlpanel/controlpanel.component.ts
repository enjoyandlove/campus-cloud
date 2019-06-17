import { ActivatedRoute, Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';

import { isProd } from '@campus-cloud/config/env';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPAmplitudeService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html'
})
export class ControlPanelComponent implements AfterViewInit {
  isProd = isProd;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cpTrackingService: CPTrackingService,
    private cpAmplitudeService: CPAmplitudeService
  ) {}

  trackLoggedInEvent() {
    const isLogin = 'login' in this.route.snapshot.queryParams;

    if (isLogin) {
      this.cpTrackingService.amplitudeEmitEvent(amplitudeEvents.LOGGED_IN);
    }
  }

  ngAfterViewInit() {
    /**
     * this gets initilized only once
     * so we track the first page load here
     */
    this.cpAmplitudeService.loadAmplitude();
    this.cpTrackingService.gaTrackPage(this.router.url);
    this.trackLoggedInEvent();
  }
}

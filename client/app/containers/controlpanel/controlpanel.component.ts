import { ActivatedRoute, Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';

import { isProd } from '../../config/env';
import { CPSession } from './../../session';
import { amplitudeEvents } from '../../shared/constants/analytics';
import { CPAmplitudeService, userType } from '../../shared/services';
import { CPTrackingService } from './../../shared/services/tracking.service';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html'
})
export class ControlPanelComponent implements AfterViewInit {
  isProd = isProd;
  is_onboarded = true;

  constructor(
    private router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpTrackingService: CPTrackingService,
    private cpAmplitudeService: CPAmplitudeService
  ) {}

  trackLoggedInEvent() {
    const isLogin = 'login' in this.route.snapshot.queryParams;
    const user_type = this.is_onboarded ? userType.existing : userType.new;

    if (isLogin) {
      this.cpTrackingService.amplitudeEmitEvent(
        amplitudeEvents.LOGGED_IN,
        { user_type }
      );
    }
  }

  ngAfterViewInit() {
    this.is_onboarded = this.session.g.get('user').flags.is_onboarding;
    if (!this.is_onboarded) {
      setTimeout(
        () => {
          $('#openOnboardingModal').modal({
            keyboard: false,
            backdrop: 'static'
          });
        },

        1
      );
    }
    /**
     * this gets initilized only once
     * so we track the first page load here
     */
    this.cpAmplitudeService.loadAmplitude(this.session);
    this.cpTrackingService.gaTrackPage(this.router.url);
    this.trackLoggedInEvent();
  }
}

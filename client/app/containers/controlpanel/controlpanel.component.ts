import { CPSession } from './../../session/index';
import { Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';

import { isProd } from '../../config/env';
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
    private cpTrackingService: CPTrackingService
  ) {}

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
    this.cpTrackingService.loadAmplitude(this.session.g);
    this.cpTrackingService.gaTrackPage(this.router.url);
  }
}

import { CPSession } from './../../session/index';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { isProd } from '../../config/env';
import { CPTrackingService } from './../../shared/services/tracking.service';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent implements OnInit {
  isProd = isProd;
  is_onboarded = true;

  constructor(
    private router: Router,
    private session: CPSession,
    private cpTrackingService: CPTrackingService,
  ) {}

  ngOnInit() {
    this.is_onboarded = this.session.g.get('user').flags.is_onboarding;
    if (!this.is_onboarded) {
      setTimeout(() => {
        $('#openOnboardingModal').modal({
          keyboard: false,
          backdrop: 'static',
        });
      }, 1);
    }
    /**
     * this gets initilized only once
     * so we track the first page load here
     */
    CPTrackingService.loadAmplitude(this.session.g.get('user').email);
    this.cpTrackingService.gaTrackPage(this.router.url);
  }
}

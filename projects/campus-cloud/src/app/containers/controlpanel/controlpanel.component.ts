import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CPSession } from '@campus-cloud/session';
import { EnvService } from '@campus-cloud/config/env';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPAmplitudeService, AdminService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html'
})
export class ControlPanelComponent implements AfterViewInit, OnInit {
  constructor(
    private router: Router,
    private env: EnvService,
    private session: CPSession,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private cpTrackingService: CPTrackingService,
    private cpAmplitudeService: CPAmplitudeService
  ) {}

  get currentRoutePath(): string {
    // remove previous fragments and query params
    return `${this.router.url.split('#')[0].split('?')[0]}/`;
  }

  trackLoggedInEvent() {
    const isLogin = 'login' in this.route.snapshot.queryParams;

    if (isLogin) {
      const isOnboarding = this.session.g.get('user').flags.is_onboarding;
      const user_type = isOnboarding ? amplitudeEvents.EXISTING : amplitudeEvents.NEW;
      this.cpTrackingService.amplitudeEmitEvent(amplitudeEvents.LOGGED_IN, { user_type });

      if (!isOnboarding) {
        this.updateAdminStatus();
      }
    }
  }

  updateAdminStatus() {
    const body = {
      flags: {
        is_onboarding: true
      }
    };

    this.adminService.updateAdmin(this.session.g.get('user').id, body).subscribe((response) => {
      this.session.g.set('user', response);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    /**
     * this gets initialized only once
     * so we track the first page load here TEST
     */
    this.cpAmplitudeService.loadAmplitude();
    this.cpTrackingService.gaTrackPage(this.router.url);
    this.trackLoggedInEvent();
  }
}

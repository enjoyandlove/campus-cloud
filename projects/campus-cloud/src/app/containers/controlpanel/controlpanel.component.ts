import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@ready-education/ready-ui';

import { CPSession } from '@campus-cloud/session';
import { EnvService } from '@campus-cloud/config/env';
import { appStorage, base64 } from '../../shared/utils';
import { ControlPanelService } from './controlpanel.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPAmplitudeService, AdminService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html'
})
export class ControlPanelComponent implements AfterViewInit, OnInit {
  isProd = this.env.name === 'production';

  constructor(
    private router: Router,
    private env: EnvService,
    private session: CPSession,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastService: ToastService,
    private service: ControlPanelService,
    private cpTrackingService: CPTrackingService,
    private cpAmplitudeService: CPAmplitudeService
  ) {}

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

  trackBannerClick(interaction_type: string) {
    this.cpTrackingService.amplitudeEmitEvent(amplitudeEvents.VIEWED_BANNER, {
      interaction_type
    });
  }
  onToastDissmised(id: number) {
    this.setBannerCookie(id);
    this.trackBannerClick('Dismissed');
  }

  onToastLearnMoreClicked(id: number) {
    this.setBannerCookie(id);
    this.trackBannerClick('Interacted');
  }

  setBannerCookie(id: number) {
    appStorage.set(base64.encode(appStorage.keys.CHANGE_LOG), id.toString());
  }

  showToast({ linkText, linkUrl, title, id }) {
    this.toastService.show({
      type: 'info',
      text: title,
      cta: {
        text: linkText,
        url: linkUrl,
        ctaClickHandler: this.onToastLearnMoreClicked.bind(this, id)
      },
      dismissClickHandler: this.onToastDissmised.bind(this, id)
    });
  }

  loadWhatsNew() {
    this.service.getBeamerPosts().subscribe(({ id, translations }: any) => {
      const { linkText, linkUrl, title } = translations[0];
      const previousChangeLogKey = appStorage.get(base64.encode(appStorage.keys.CHANGE_LOG));

      if (!previousChangeLogKey || previousChangeLogKey !== id.toString()) {
        this.showToast({ linkText, linkUrl, title, id });
      }
    });
  }

  ngOnInit() {
    if (this.isProd) {
      setTimeout(() => {
        this.loadWhatsNew();
      }, 1000);
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

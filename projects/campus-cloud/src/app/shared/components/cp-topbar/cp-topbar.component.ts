import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { get as _get } from 'lodash';

import { EnvService } from '@campus-cloud/config/env';
import { appStorage, base64 } from '@campus-cloud/shared/utils';
import { ContactTraceFeatureLevel, CPSession, ISchool, IUser } from '@campus-cloud/session';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { CP_PRIVILEGES_MAP, amplitudeEvents } from '@campus-cloud/shared/constants';
import {
  canAccountLevelReadResource,
  canSchoolReadResource
} from '@campus-cloud/shared/utils/privileges';

@Component({
  selector: 'cp-topbar',
  templateUrl: './cp-topbar.component.html',
  styleUrls: ['./cp-topbar.component.scss']
})
export class CPTopBarComponent implements OnInit {
  user: IUser;
  releaseId = 4;
  amplitudeEvents = {
    menu_home: amplitudeEvents.BANNER,
    menu_manage: amplitudeEvents.MENU_MANAGE,
    menu_notify: amplitudeEvents.MENU_NOTIFY,
    menu_assess: amplitudeEvents.MENU_ASSESS,
    menu_studio: amplitudeEvents.MENU_STUDIO,
    menu_audience: amplitudeEvents.MENU_AUDIENCE,
    menu_contact_trace: amplitudeEvents.MENU_CONTACT_TRACE
  };
  school: ISchool;
  highlight = false;
  canNotify = false;
  canManage = false;
  canAssess = false;
  canAudience = false;
  canCustomise = false;
  canContractTrace = false;
  isManageActiveRoute;
  manageHomePage: string;
  production = this.env.name === 'production';
  logo = `${environment.root}assets/svg/logo.svg`;
  helpIcon = `${environment.root}assets/svg/help/help.svg`;
  defaultImage = `${environment.root}assets/default/user.png`;
  contactTraceRouterLink: string[] = [];

  constructor(
    public router: Router,
    public el: ElementRef,
    private env: EnvService,
    public session: CPSession,
    public cpTracking: CPTrackingService
  ) {}

  getManageHomePage() {
    if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events)) {
      return 'events';
    } else if (
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation) &&
      _get(this.session.g.get('schoolConfig'), 'campus_wall_enabled', false)
    ) {
      return 'feeds';
    } else if (
      canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs) ||
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs)
    ) {
      return 'clubs';
    } else if (
      canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.athletics) ||
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.athletics)
    ) {
      return 'athletics';
    } else if (
      canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.services) ||
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.services)
    ) {
      return 'services';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.calendar)) {
      return 'calendars';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_maps)) {
      return 'locations';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.links)) {
      return 'links';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation)) {
      return 'orientation';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.jobs)) {
      return 'jobs';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.deals)) {
      return 'deals';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.dining)) {
      return 'dining';
    }

    return null;
  }

  isManage(url) {
    return url.split('/').includes('manage');
  }

  trackMenu(menu_name) {
    const eventName = amplitudeEvents.CLICKED_MENU;
    const eventProperties = { menu_name };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  setWhatsNewCookie() {
    this.highlight = false;
    appStorage.set(base64.encode(appStorage.keys.HELP_ICON), this.releaseId.toString());

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.VIEWED_INFORMATION, {
      information_type: 'Dropdown'
    });
  }

  showWhatsNew() {
    const previousChangeLogKey = appStorage.get(base64.encode(appStorage.keys.HELP_ICON));
    this.highlight = !previousChangeLogKey || previousChangeLogKey !== this.releaseId.toString();
  }

  ngOnInit() {
    if (this.env.name === 'production') {
      this.showWhatsNew();
    }

    this.user = this.session.g.get('user');
    this.school = this.session.g.get('school');

    this.manageHomePage = this.getManageHomePage();

    this.canNotify = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements);
    this.canAudience = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.audience);
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);
    this.canCustomise = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.app_customization);

    const serviceId: number = this.session.g.get('school').ct_service_id;
    if (serviceId === -1 || this.school.contact_trace_feature_level === ContactTraceFeatureLevel.Disabled) {
      this.canContractTrace = false;
    } else {
      const canContactTraceQR = canSchoolReadResource(
        this.session.g,
        CP_PRIVILEGES_MAP.contact_trace_qr
      );
      const canContactTraceForms =
        (this.school.contact_trace_feature_level === ContactTraceFeatureLevel.Plus)
        ? canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms)
        : false
      this.canContractTrace = canContactTraceQR || canContactTraceForms;

      if (canContactTraceForms) {
        this.contactTraceRouterLink = ['/contact-trace'];
      } else if (canContactTraceQR) {
        this.contactTraceRouterLink = ['/contact-trace/qr'];
      }
    }

    this.isManageActiveRoute = this.isManage(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isManageActiveRoute = !!this.isManage(event.url);
      }
    });
  }
}

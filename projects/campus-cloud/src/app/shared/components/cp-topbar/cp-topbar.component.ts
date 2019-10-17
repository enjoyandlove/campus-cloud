import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';
import { CPSession, ISchool, IUser } from '@campus-cloud/session';
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
  amplitudeEvents;
  school: ISchool;
  canNotify = false;
  canManage = false;
  canAssess = false;
  canAudience = false;
  canCustomise = false;
  isManageActiveRoute;
  manageHomePage: string;
  production = this.env.name === 'production';
  logo = `${environment.root}assets/svg/logo.svg`;
  helpIcon = `${environment.root}assets/svg/help/help.svg`;
  defaultImage = `${environment.root}assets/default/user.png`;

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
      this.session.g.get('schoolConfig').campus_wall_enabled
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

  ngOnInit() {
    this.user = this.session.g.get('user');
    this.school = this.session.g.get('school');

    this.manageHomePage = this.getManageHomePage();

    this.canNotify = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements);
    this.canAudience = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.audience);
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);
    this.canCustomise = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.app_customization);

    this.isManageActiveRoute = this.isManage(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isManageActiveRoute = this.isManage(event.url) ? true : false;
      }
    });

    this.amplitudeEvents = {
      menu_home: amplitudeEvents.BANNER,
      menu_manage: amplitudeEvents.MENU_MANAGE,
      menu_notify: amplitudeEvents.MENU_NOTIFY,
      menu_assess: amplitudeEvents.MENU_ASSESS,
      menu_studio: amplitudeEvents.MENU_STUDIO,
      menu_audience: amplitudeEvents.MENU_AUDIENCE
    };
  }
}

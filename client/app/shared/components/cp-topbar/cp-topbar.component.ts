import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { CPSession, ISchool, IUser } from '../../../session';

import { CP_PRIVILEGES_MAP } from './../../constants';

import { canAccountLevelReadResource, canSchoolReadResource } from './../../utils/privileges';

@Component({
  selector: 'cp-topbar',
  templateUrl: './cp-topbar.component.html',
  styleUrls: ['./cp-topbar.component.scss']
})
export class CPTopBarComponent implements OnInit {
  isOpen;
  user: IUser;
  school: ISchool;
  canNotify = false;
  canManage = false;
  canAssess = false;
  canAduience = false;
  canCustomise = false;
  manageHomePage: string;

  isManageActiveRoute;
  logo = require('public/svg/logo.svg');
  defaultImage = require('public/default/user.png');

  constructor(public el: ElementRef, public session: CPSession, public router: Router) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }

  getManageHomePage() {
    if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events)) {
      return 'events';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation)) {
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
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements)) {
      return 'lists';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_maps)) {
      return 'locations';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.links)) {
      return 'links';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.app_customization)) {
      return 'customization';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation)) {
      return 'orientation';
    }

    return null;
  }

  isManage(url) {
    return url.split('/').includes('manage');
  }

  ngOnInit() {
    this.user = this.session.g.get('user');
    this.school = this.session.g.get('school');

    this.manageHomePage = this.getManageHomePage();

    this.canNotify = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements);
    this.canAduience = canSchoolReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.campus_announcements
    );
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);
    this.canCustomise = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.app_customization);

    this.isManageActiveRoute = this.isManage(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isManageActiveRoute = this.isManage(event.url) ? true : false;
      }
    });
  }
}

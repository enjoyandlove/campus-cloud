import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { CP_PRIVILEGES_MAP } from './../../constants';
import { CPSession, IUser, ISchool } from '../../../session';

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
  manageHomePage: string;

  isManageActiveRoute;

  logo = require('public/svg/logo.svg');
  defaultImage = require('public/default/user.png');

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private router: Router
  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }

  getManageHomePage() {
    if (this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.events))  {
      return 'events';
    } else if (this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.moderation))  {
      return 'feeds';
    } else if (
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.clubs) ||
      this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.clubs)
    )  {
      return 'clubs';
    } else if (
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.services) ||
      this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.services)
    )  {
      return 'services';
    } else if (this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.campus_announcements))  {
      return 'lists';
    } else if (this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.links))  {
      return 'links';
    }
    return null;
  }

  isManage(url) {
    return url.split('/').includes('manage');
  }

  ngOnInit() {
    this.user = this.session.user;
    this.school = this.session.school;

    this.manageHomePage = this.getManageHomePage();

    this.canNotify = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.campus_announcements);
    this.canAssess = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.assessment);

    this.isManageActiveRoute = this.isManage(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.isManage(event.url)) {
          this.isManageActiveRoute = true;
        } else {
          this.isManageActiveRoute = false;
        }
      }
    })
  }
}

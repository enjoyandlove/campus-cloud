import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import {
  canSchoolReadResource,
  canAccountLevelReadResource
} from './../../utils/privileges';

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
    public el: ElementRef,
    public session: CPSession,
    public router: Router
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
    if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events))  {
      return 'events';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation))  {
      return 'feeds';
    } else if (
      canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs) ||
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs)
    )  {
      return 'clubs';
    } else if (
      canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.services) ||
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.services)
    )  {
      return 'services';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements))  {
      return 'lists';
    } else if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.links))  {
      return 'links';
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
    this.canAssess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.assessment);

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

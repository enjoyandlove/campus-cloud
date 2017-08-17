import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

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
    if (this.session.privileges.readEvent)  {
      return 'events';
    } else if (this.session.privileges.readFeed)  {
      return 'feeds';
    } else if (this.session.privileges.readClub)  {
      return 'clubs';
    } else if (this.session.privileges.readService)  {
      return 'services';
    } else if (this.session.privileges.readList)  {
      return 'lists';
    } else if (this.session.privileges.readLink)  {
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
    this.canNotify = this.session.privileges.readNotify;
    this.canAssess = this.session.privileges.readAssess;

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

    // console.log(this.router.isActive('manage', false));
  }
}

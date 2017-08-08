import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

import { CPSession, IUser, ISchool } from '../../../session';
import { isDev } from './../../../config/env/index';

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

  logo = require('public/svg/logo.svg');

  constructor(
    private el: ElementRef,
    private session: CPSession
  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }

  logPrivileges() {
    if (isDev) {
      console.table(
        [
        [ 'canViewAssess', this.session.canViewAssess(this.school.id) ],
        [ 'canViewClubs', this.session.canViewClubs(this.school.id) ],
        [ 'canViewEvents', this.session.canViewEvents(this.school.id) ],
        [ 'canViewFeeds', this.session.canViewFeeds(this.school.id) ],
        [ 'canViewLinks', this.session.canViewLinks(this.school.id) ],
        [ 'canViewLists', this.session.canViewLists(this.school.id) ],
        [ 'canViewNotify', this.session.canViewNotify(this.school.id) ],
        [ 'canViewServices', this.session.canViewServices(this.school.id) ],
        [ 'canViewTeamSettings', this.session.canViewTeamSettings(this.school.id) ]
        ]
      );
    }
  }

  getManageHomePage() {
    if (this.session.canViewEvents(this.school.id)) {
      return 'events';
    } else if (this.session.canViewFeeds(this.school.id)) {
      return 'feeds';
    } else if (this.session.canViewClubs(this.school.id)) {
      return 'clubs';
    } else if (this.session.canViewServices(this.school.id)) {
      return 'services';
    } else if (this.session.canViewNotify(this.school.id)) {
      return 'lists';
    } else if (this.session.canViewLinks(this.school.id)) {
      return 'links';
    }
    return null;
  }

  ngOnInit() {
    this.user = this.session.user;
    this.school = this.session.school;

    this.manageHomePage = this.getManageHomePage();
    this.canNotify = this.session.canViewNotify(this.school.id);
    this.canAssess = this.session.canViewAssess(this.school.id);

    this.logPrivileges();
  }
}

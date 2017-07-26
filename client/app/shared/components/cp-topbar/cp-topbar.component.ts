import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

import { CPSession, IUser, ISchool } from '../../../session';
import { CP_PRIVILEGES_MAP } from '../../../shared/utils/privileges';

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
  logo = require('../../../../public/svg/logo.svg');

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

  ngOnInit() {
    this.user = this.session.user;
    this.school = this.session.school;
    let schoolPrivileges = this.user.school_level_privileges[this.school.id];


    try {
      this.canNotify = schoolPrivileges[CP_PRIVILEGES_MAP.campus_announcements].r;
    } catch (error) {
      this.canNotify = false;
    }

    try {
      this.canAssess = schoolPrivileges[CP_PRIVILEGES_MAP.assessment].r;
    } catch (error) {
      this.canAssess = false;
    }
    // this.canNotify = schoolPrivileges[CP_PRIVILEGES_MAP.campus_announcements].r;
    // let schoolPrivileges = this.user.school_level_privileges[this.school.id];

  //   let manageItems = [
  //     CP_PRIVILEGES_MAP.events,
  //     CP_PRIVILEGES_MAP.moderation,
  //     CP_PRIVILEGES_MAP.clubs,
  //     CP_PRIVILEGES_MAP.services,
  //     CP_PRIVILEGES_MAP.links,
  //     CP_PRIVILEGES_MAP.app_customization,
  //     CP_PRIVILEGES_MAP.campus_maps,
  //   ];

  //   if (schoolPrivileges[CP_PRIVILEGES_MAP.campus_announcements] ||
  //     schoolPrivileges[CP_PRIVILEGES_MAP.emergency_announcement]) {
  //     this.canNotify = true;
  //   }

  //   manageItems.forEach(privilege => {
  //     if (schoolPrivileges[privilege]) {
  //       this.canManage = true;
  //     }
  //   });
  }
}

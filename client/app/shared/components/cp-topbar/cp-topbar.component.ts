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
    let privileges = this.user.school_level_privileges[this.school.id];

    if (privileges[CP_PRIVILEGES_MAP.campus_announcements] ||
      privileges[CP_PRIVILEGES_MAP.emergency_announcement]) {
      this.canNotify = true;
    }
  }
}

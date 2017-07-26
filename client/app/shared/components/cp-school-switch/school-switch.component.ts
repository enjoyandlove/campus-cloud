import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession, ISchool, IUser } from '../../../session';
import { appStorage } from '../../../shared/utils/localStorage';
import { CP_PRIVILEGES_MAP } from '../../../shared/utils/privileges';

@Component({
  selector: 'cp-school-switch',
  templateUrl: './school-switch.component.html',
  styleUrls: ['./school-switch.component.scss']
})
export class SchoolSwitchComponent implements OnInit {
  @Output() close: EventEmitter<null> = new EventEmitter();

  isSchoolPanel;
  canManageAdmins;
  selectedSchool: ISchool;
  schools: Array<ISchool> = [];

  constructor(
    private session: CPSession
  ) { }

  onSwitchSchool(event, school) {
    event.preventDefault();

    if (school.id === this.selectedSchool.id) { return; }

    appStorage.set(appStorage.keys.DEFAULT_SCHOOL, JSON.stringify(school));
    window.location.replace('/');
  }

  onGoToSchools(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSchoolPanel = !this.isSchoolPanel;
  }

  ngOnInit() {
    this.schools = this.session.schools;
    this.selectedSchool = this.session.school;

    const user: IUser = this.session.user;

    let schoolPrivileges = user.school_level_privileges[this.session.school.id];

    this.canManageAdmins = false;

    if (schoolPrivileges) {
      let manage_admin = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

      schoolPrivileges = user.school_level_privileges[this.session.school.id];

      this.canManageAdmins = manage_admin ? manage_admin : false;
    }
  }
}

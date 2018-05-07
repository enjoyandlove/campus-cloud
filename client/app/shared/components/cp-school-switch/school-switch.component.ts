import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CPSession, ISchool, IUser } from '../../../session';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { appStorage } from '../../../shared/utils/storage';
import { CPI18nService } from '../../services';

@Component({
  selector: 'cp-school-switch',
  templateUrl: './school-switch.component.html',
  styleUrls: ['./school-switch.component.scss'],
})
export class SchoolSwitchComponent implements OnInit {
  @Output() close: EventEmitter<null> = new EventEmitter();

  helpDeskUrl;
  isSchoolPanel;
  canManageAdmins;
  selectedSchool: ISchool;
  schools: Array<ISchool> = [];
  defaultImage = require('public/default/user.png');

  constructor(public session: CPSession) {}

  onSwitchSchool(event, school) {
    event.preventDefault();

    if (school.id === this.selectedSchool.id) {
      return;
    }

    appStorage.set(appStorage.keys.DEFAULT_SCHOOL, JSON.stringify(school));
    window.location.replace('/');
  }

  onGoToSchools(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSchoolPanel = !this.isSchoolPanel;
  }

  ngOnInit() {
    this.helpDeskUrl =
      CPI18nService.getLocale() === 'fr-CA'
        ? 'https://oohlalamobile.zendesk.com/hc/fr'
        : 'https://oohlalamobile.zendesk.com/hc/en-us';

    this.schools = this.session.g.get('schools');
    this.selectedSchool = this.session.g.get('school');

    const user: IUser = this.session.g.get('user');

    let schoolPrivileges =
      user.school_level_privileges[this.session.g.get('school').id];

    this.canManageAdmins = false;

    if (schoolPrivileges) {
      const manage_admin = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

      schoolPrivileges =
        user.school_level_privileges[this.session.g.get('school').id];

      this.canManageAdmins = manage_admin ? manage_admin : false;
    }
  }
}

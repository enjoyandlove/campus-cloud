import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { appStorage } from '@campus-cloud/shared/utils/storage';
import { CPSession, ISchool, IUser } from '@campus-cloud/session';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { ZendeskService, CPTrackingService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP, amplitudeEvents } from '@campus-cloud/shared/constants';

@Component({
  selector: 'cp-school-switch',
  templateUrl: './school-switch.component.html',
  styleUrls: ['./school-switch.component.scss']
})
export class SchoolSwitchComponent implements OnInit {
  @Output() close: EventEmitter<null> = new EventEmitter();

  helpDeskUrl;
  isSchoolPanel;
  canManageApis;
  canManageAdmins;
  amplitudeEvents;
  canManageTestUsers;
  selectedSchool: ISchool;
  schools: Array<ISchool> = [];
  defaultImage = `${environment.root}assets/default/user.png`;

  constructor(public session: CPSession, public cpTracking: CPTrackingService) {}

  onSwitchSchool(event, school: ISchool) {
    event.preventDefault();

    if (school.id === this.selectedSchool.id) {
      return;
    }

    appStorage.set(appStorage.keys.DEFAULT_SCHOOL_ID, school.id.toString());
    window.location.replace('/');
  }

  onGoToSchools(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSchoolPanel = !this.isSchoolPanel;
  }

  trackEvent(eventName, school = null) {
    let eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties()
    };

    if (school) {
      const name = school.is_sandbox ? amplitudeEvents.TEST_SCHOOL : amplitudeEvents.SCHOOL;

      eventProperties = {
        ...eventProperties,
        name
      };
    }

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  ngOnInit() {
    this.helpDeskUrl = ZendeskService.zdRoot();

    this.schools = this.session.g.get('schools');
    this.selectedSchool = this.session.g.get('school');

    const user: IUser = this.session.g.get('user');

    let schoolPrivileges = user.school_level_privileges[this.selectedSchool.id];
    const clientPrivileges = user.client_level_privileges[this.selectedSchool.client_id];

    this.canManageAdmins = false;
    this.canManageTestUsers = false;

    if (schoolPrivileges) {
      const manage_admin = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

      schoolPrivileges = user.school_level_privileges[this.selectedSchool.id];

      this.canManageAdmins = manage_admin ? manage_admin : false;
    }

    if (clientPrivileges) {
      this.canManageTestUsers =
        clientPrivileges[CP_PRIVILEGES_MAP.test_users] && this.selectedSchool.is_sandbox;

      this.canManageApis = clientPrivileges[CP_PRIVILEGES_MAP.api_management];
    }

    this.amplitudeEvents = {
      logged_out: amplitudeEvents.LOGGED_OUT,
      changed_school: amplitudeEvents.CHANGED_SCHOOL
    };
  }
}

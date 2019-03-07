import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { appStorage } from '../../../shared/utils/storage';
import { amplitudeEvents } from '../../constants/analytics';
import { CPSession, ISchool, IUser } from '../../../session';
import { CP_PRIVILEGES_MAP } from '../../../shared/constants';
import { CPTrackingService, RouteLevel } from '../../services';
import { ZendeskService } from './../../services/zendesk.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'cp-school-switch',
  templateUrl: './school-switch.component.html',
  styleUrls: ['./school-switch.component.scss']
})
export class SchoolSwitchComponent implements OnInit {
  @Output() close: EventEmitter<null> = new EventEmitter();

  helpDeskUrl;
  isSchoolPanel;
  canManageAdmins;
  amplitudeEvents;
  canManageTestUsers;
  selectedSchool: ISchool;
  schools: Array<ISchool> = [];
  defaultImage = `${environment.root}public/default/user.png`;

  constructor(public session: CPSession, public cpTracking: CPTrackingService) {}

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

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

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
    }

    this.amplitudeEvents = {
      logged_out: amplitudeEvents.LOGGED_OUT,
      changed_school: amplitudeEvents.CHANGED_SCHOOL,
      visited_help_desk: amplitudeEvents.VISITED_HELP_DESK
    };
  }
}

import { Injectable } from '@angular/core';
import * as amplitude from 'amplitude-js';
import { get as _get } from 'lodash';

import { CPSession } from '../../session';
import { amplitudeEvents } from '../constants/analytics';
import { CP_PRIVILEGES_MAP } from '../constants/privileges';
import { isCanada, isProd, isUsa } from '../../config/env';

@Injectable()
export class CPAmplitudeService {
  user;
  school;
  isInternal;

  constructor(public session: CPSession) {}

  loadAmplitude() {
    this.user = this.session.g.get('user');
    this.school = this.session.g.get('school');
    this.isInternal = this.session.isInternal;
    const api_key = isProd
      ? '24c823bab76344e912538ef6a942f517'
      : '434caff2f839c60ab12edd1119ec7641';

    amplitude.init(api_key, this.getSchoolUserID(this.user), {}, () => {
      this.setIdentity();
    });
  }

  setIdentity() {
    if (this.school && this.user) {
      const userPermissions = this.getUserPermissionsEventProperties();

      const userProperties = {
        is_oohlala: this.isInternal,
        school_name: this.school.name,
        test_school: this.school.is_sandbox,
        jobs: userPermissions.jobs_permission,
        links: userPermissions.links_permission,
        deals: userPermissions.deals_permission,
        walls: userPermissions.walls_permission,
        events: userPermissions.event_permission,
        notify: userPermissions.notify_permission,
        assess: userPermissions.assess_permission,
        studio: userPermissions.studio_permission,
        school_id: this.getSchoolUserID(this.school),
        calendar: userPermissions.calendar_permission,
        audiences: userPermissions.audience_permission,
        team_member: userPermissions.invite_permission,
        locations: userPermissions.locations_permission,
        club_executive: userPermissions.club_permission,
        orientation: userPermissions.orientation_permission,
        service_executive: userPermissions.service_permission,
        athletics_executive: userPermissions.athletic_permission
      };

      amplitude.getInstance().setUserProperties(userProperties);
    }
  }

  getSchoolUserID(user) {
    if (!user) {
      return;
    }

    if (isCanada) {
      return `CAN${user.id}`;
    } else if (isUsa) {
      return `US${user.id}`;
    } else {
      // default for dev
      return `US${user.id}`;
    }
  }

  private get schoolLevelPrivilege() {
    if (!this.user || !this.school) {
      return {};
    }

    return _get(this.user, ['school_level_privileges', this.school.id], {});
  }

  private get accountLevelPrivilege() {
    if (!this.user) {
      return {};
    }

    return _get(this.user, 'account_level_privileges', {});
  }

  getUserPermissionsEventProperties() {
    const eventPermission = this.getEventPermissions();

    const notifyPermission = this.getNotifyPermissions();

    const invitePermission = this.getUserPermissionsStatus(CP_PRIVILEGES_MAP.manage_admin);

    const assessPermission = this.getUserPermissionsStatus(CP_PRIVILEGES_MAP.assessment);

    const clubPermission = this.getSchoolOrAccountLevelPermissions(CP_PRIVILEGES_MAP.clubs);

    const servicePermission = this.getSchoolOrAccountLevelPermissions(CP_PRIVILEGES_MAP.services);

    const athleticPermission = this.getSchoolOrAccountLevelPermissions(CP_PRIVILEGES_MAP.athletics);

    const audiencePermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.audience);

    const jobsPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.jobs);

    const linksPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.links);

    const dealsPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.deals);

    const wallsPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.moderation);

    const calendarPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.calendar);

    const locationsPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.campus_maps);

    const orientationPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.orientation);

    const studioPermission = this.getUserPermissionsAccessType(CP_PRIVILEGES_MAP.app_customization);

    return {
      club_permission: clubPermission,
      jobs_permission: jobsPermission,
      links_permission: linksPermission,
      event_permission: eventPermission,
      deals_permission: dealsPermission,
      walls_permission: wallsPermission,
      notify_permission: notifyPermission,
      assess_permission: assessPermission,
      invite_permission: invitePermission,
      studio_permission: studioPermission,
      service_permission: servicePermission,
      audience_permission: audiencePermission,
      athletic_permission: athleticPermission,
      calendar_permission: calendarPermission,
      locations_permission: locationsPermission,
      orientation_permission: orientationPermission
    };
  }

  getSchoolOrAccountLevelPermissions(type) {
    const schoolPrivileges = this.schoolLevelPrivilege;
    const accountPrivileges = this.accountLevelPrivilege;

    let permissions;
    const privileges = schoolPrivileges[type];

    if (!privileges) {
      permissions = amplitudeEvents.NO_ACCESS;
      Object.keys(accountPrivileges).forEach((store) => {
        if (accountPrivileges[store][type]) {
          permissions = amplitudeEvents.SELECT_ACCESS;
        }
      });
    } else if (privileges.r && privileges.w) {
      permissions = amplitudeEvents.FULL_ACCESS;
    } else {
      permissions = amplitudeEvents.SELECT_ACCESS;
    }

    return permissions;
  }

  getEventPermissions() {
    const schoolPrivileges = this.schoolLevelPrivilege;

    const noReadWritePrivilege = {
      r: false,
      w: false
    };

    let permissions = amplitudeEvents.NO_ACCESS;

    const eventPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events] || noReadWritePrivilege;

    const eventAssessmentPrivilege =
      schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance] || noReadWritePrivilege;

    if (eventPrivilege.w && eventAssessmentPrivilege.w) {
      permissions = amplitudeEvents.FULL_ACCESS;
    } else if (eventPrivilege.w) {
      permissions = amplitudeEvents.SELECT_ACCESS;
    }

    return permissions;
  }

  getUserPermissionsStatus(type) {
    const schoolPrivileges = this.schoolLevelPrivilege;

    return schoolPrivileges[type] ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
  }

  getUserPermissionsAccessType(type) {
    const schoolPrivileges = this.schoolLevelPrivilege;

    return schoolPrivileges[type] ? amplitudeEvents.FULL_ACCESS : amplitudeEvents.NO_ACCESS;
  }

  getNotifyPermissions() {
    const schoolPrivileges = this.schoolLevelPrivilege;

    let permissions;
    const regular = schoolPrivileges[CP_PRIVILEGES_MAP.campus_announcements];
    const emergency = schoolPrivileges[CP_PRIVILEGES_MAP.emergency_announcement];

    if (regular && emergency) {
      permissions = amplitudeEvents.FULL_ACCESS;
    } else if (regular) {
      permissions = amplitudeEvents.SELECT_ACCESS;
    } else {
      permissions = amplitudeEvents.NO_ACCESS;
    }

    return permissions;
  }
}

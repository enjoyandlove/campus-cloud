import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from './../../session';
import { amplitudeEvents } from '../constants/analytics';
import { CP_PRIVILEGES_MAP } from '../constants/privileges';
import { isCanada, isProd, isSea, isUsa } from '../../config/env';

declare var window: any;

@Injectable()
export class CPAmplitudeService {
  constructor(private session: CPSession) {}

  loadAmplitude() {
    const user = _get(this.session.g.get('user'), null);
    const school = _get(this.session.g.get('school'), null);
    const isInternal = this.session.isInternal;

    const api_key = isProd
      ? '24c823bab76344e912538ef6a942f517'
      : '434caff2f839c60ab12edd1119ec7641';

    require('node_modules/amplitude-js/src/amplitude-snippet.js');

    if (user && school) {
      try {
        window.amplitude.getInstance().init(api_key, this.getSchoolUserID(user));
      } catch {
        return;
      }
      this.setIdentity(school, isInternal);
    }
  }

  setIdentity(school, is_oohlala) {
    const accountLevelPrivileges = this.getAccountLevelPrivilege();
    const schoolLevelPrivileges = this.getSchoolLevelPrivileges(school.id);

    const userPermissions = this.getUserPermissionsEventProperties(
      schoolLevelPrivileges,
      accountLevelPrivileges
    );

    const userProperties = {
      is_oohlala,
      school_name: school.name,
      jobs: userPermissions.jobs_permission,
      links: userPermissions.links_permission,
      deals: userPermissions.deals_permission,
      school_id: this.getSchoolUserID(school),
      walls: userPermissions.walls_permission,
      events: userPermissions.event_permission,
      notify: userPermissions.notify_permission,
      assess: userPermissions.assess_permission,
      studio: userPermissions.studio_permission,
      calendar: userPermissions.calendar_permission,
      audiences: userPermissions.audience_permission,
      team_member: userPermissions.invite_permission,
      locations: userPermissions.locations_permission,
      club_executive: userPermissions.club_permission,
      orientation: userPermissions.orientation_permission,
      service_executive: userPermissions.service_permission,
      athletics_executive: userPermissions.athletic_permission
    };

    window.amplitude.getInstance().setUserProperties(userProperties);
  }

  getSchoolUserID(user) {
    if (!user) {
      return;
    }

    if (isCanada) {
      return `CAN${user.id}`;
    } else if (isSea) {
      return `SEA${user.id}`;
    } else if (isUsa) {
      return `US${user.id}`;
    } else {
      // default for dev
      return `US${user.id}`;
    }
  }

  getUserPermissionsEventProperties(schoolPrivileges, accountPrivileges) {
    const eventPermission = this.getEventPermissions(schoolPrivileges);

    const notifyPermission = this.getNotifyPermissions(schoolPrivileges);

    const invitePermission = this.getUserPermissionsStatus(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.manage_admin
    );

    const assessPermission = this.getUserPermissionsStatus(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.assessment
    );

    const clubPermission = this.getSchoolOrAccountLevelPermissions(
      schoolPrivileges,
      accountPrivileges,
      CP_PRIVILEGES_MAP.clubs
    );

    const servicePermission = this.getSchoolOrAccountLevelPermissions(
      schoolPrivileges,
      accountPrivileges,
      CP_PRIVILEGES_MAP.services
    );

    const athleticPermission = this.getSchoolOrAccountLevelPermissions(
      schoolPrivileges,
      accountPrivileges,
      CP_PRIVILEGES_MAP.athletics
    );

    const audiencePermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.audience
    );

    const jobsPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.jobs
    );

    const linksPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.links
    );

    const dealsPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.deals
    );

    const wallsPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.moderation
    );

    const calendarPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.calendar
    );

    const locationsPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.campus_maps
    );

    const orientationPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.orientation
    );

    const studioPermission = this.getUserPermissionsAccessType(
      schoolPrivileges,
      CP_PRIVILEGES_MAP.app_customization
    );

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

  getSchoolOrAccountLevelPermissions(schoolPrivileges, accountPrivileges = {}, type) {
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

  getEventPermissions(schoolPrivileges) {
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

  getUserPermissionsStatus(schoolPrivileges, type) {
    return schoolPrivileges[type] ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
  }

  getUserPermissionsAccessType(schoolPrivileges, type) {
    return schoolPrivileges[type] ? amplitudeEvents.FULL_ACCESS : amplitudeEvents.NO_ACCESS;
  }

  getNotifyPermissions(schoolPrivileges) {
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

  getAccountLevelPrivilege() {
    const user = this.session.g.get('user');

    return _get(user, 'account_level_privileges', {});
  }

  getSchoolLevelPrivileges(schoolId: number) {
    const school = this.session.g.get('school');

    return _get(school, ['school_level_privileges', schoolId], {});
  }
}

/* tslint:disable: max-line-length */
import { Injectable } from '@angular/core';

import { amplitudeEvents } from '../constants/analytics';
import { CP_PRIVILEGES_MAP } from '../constants/privileges';

@Injectable()
export class CPAmplitudeService {
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
}

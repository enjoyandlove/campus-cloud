import { Injectable } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ContactTraceFeatureLevel, CPSession } from '@campus-cloud/session';

export enum clubAthleticStatus {
  active = 1
}

export enum isClubAthletic {
  club = 0,
  athletic = 16
}

export enum clubMenu {
  noAccess = null,
  selectClubs = 2,
  allClubs = 3
}

export enum athleticMenu {
  noAccess = null,
  selectAthletic = 2,
  allAthletics = 3
}

export enum serviceMenu {
  noAccess = null,
  selectServices = 2,
  allServices = 3
}

export enum eventMenu {
  noAccess = null,
  manageEvents = 2,
  manageEventsAndAssess = 3
}

export enum audienceMenuStatus {
  noAccess = null,
  allAccess = 1
}

export enum contactTraceMenu {
  manageQR = 2,
  manageForms = 3,
  manageCases = 4,
  manageNotifications = 5,
  manageDashboard = 6
}

export enum manageAdminMenu {
  disabled = null,
  enabled = 1
}

export enum RequestParams {
  resend = 1
}

export enum HttpErrorResponseMessage {
  adminActivated = 'admin_already_activated'
}

export enum PhraseAppKeys {
  somethingWrong = 'something_went_wrong',
  inviteSuccess = 't_team_settings_resend_invite_success',
  inviteFail = 't_team_settings_resend_invite_admin_already_activated'
}

export enum PrivacyConfiguration {
  on = 1,
  off = 0
}

@Injectable()
export class TeamUtilsService {
  constructor(public session: CPSession, public cpI18n: CPI18nService) {}

  hasStudio(schoolPrivileges) {
    return CP_PRIVILEGES_MAP.app_customization in schoolPrivileges;
  }

  hasFullStudioPrivilege(schoolPrivileges) {
    const athleticSchoolWide = CP_PRIVILEGES_MAP.athletics in schoolPrivileges;
    const clubsSchoolWide = CP_PRIVILEGES_MAP.clubs in schoolPrivileges;
    const eventsSchoolWide = CP_PRIVILEGES_MAP.events in schoolPrivileges;
    const serviceSchoolWide = CP_PRIVILEGES_MAP.services in schoolPrivileges;
    const calendarSchoolWide = CP_PRIVILEGES_MAP.calendar in schoolPrivileges;
    const orientationSchoolWide = CP_PRIVILEGES_MAP.orientation in schoolPrivileges;

    return (
      athleticSchoolWide &&
      clubsSchoolWide &&
      eventsSchoolWide &&
      serviceSchoolWide &&
      calendarSchoolWide &&
      orientationSchoolWide
    );
  }

  hasStorePrivileges(schoolPrivileges, acountPrivileges) {
    const storeAccountWide = Object.keys(acountPrivileges).length > 0;
    const clubsSchoolWide = CP_PRIVILEGES_MAP.clubs in schoolPrivileges;
    const serviceSchoolWide = CP_PRIVILEGES_MAP.services in schoolPrivileges;
    const athleticSchoolWide = CP_PRIVILEGES_MAP.athletics in schoolPrivileges;

    return clubsSchoolWide || serviceSchoolWide || athleticSchoolWide || storeAccountWide;
  }

  eventsDropdown(
    eventPrivilege = { r: false, w: false },
    eventAssessmentPrivilege = { r: false, w: false }
  ): Array<any> {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: eventMenu.noAccess
      }
    ];

    if (!eventPrivilege.r) {
      return items;
    }

    if (eventPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_manage_events'),
          action: eventMenu.manageEvents
        }
      ];
    }

    if (eventAssessmentPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_manage_and_assess_events'),
          action: eventMenu.manageEventsAndAssess
        }
      ];
    }

    return items;
  }

  audienceDropdown(schoolPrivilege = { r: false, w: false }) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: audienceMenuStatus.noAccess
      }
    ];

    if (schoolPrivilege.r) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_audience_menu_all_access'),
          action: audienceMenuStatus.allAccess
        }
      ];
    }

    return items;
  }

  contactTraceDropdown(
    viewerContactTraceQRPrivilege = { r: false, w: false },
    viewerContactTraceFormsPrivilege = { r: false, w: false },
    viewerContactTraceCasesPrivilege = { r: false, w: false },
    viewerContactTraceNotificationsPrivilege = { r: false, w: false },
    viewerContactTraceDashboardPrivilege = { r: false, w: false },
    adminContactTraceQRPrivilege = { r: false, w: false },
    adminContactTraceFormsPrivilege = { r: false, w: false },
    adminContactTraceCasesPrivilege = { r: false, w: false },
    adminContactTraceNotificationsPrivilege = { r: false, w: false },
    adminContactTraceDashboardPrivilege = { r: false, w: false }
  ): Array<any> {
    let items = [];
    if (!viewerContactTraceQRPrivilege.r
      && !viewerContactTraceFormsPrivilege.r
      && !viewerContactTraceCasesPrivilege.r
      && !viewerContactTraceNotificationsPrivilege.r
      && !viewerContactTraceDashboardPrivilege.r) {
      return items;
    }

    if (viewerContactTraceQRPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_contact_trace_qr'),
          action: contactTraceMenu.manageQR,
          selected: adminContactTraceQRPrivilege.w
        }
      ];
    }

    const { contact_trace_feature_level } = this.session.g.get('school');
    if (contact_trace_feature_level === ContactTraceFeatureLevel.Plus) {
      if (viewerContactTraceFormsPrivilege.w) {
        items = [
          ...items,
          {
            label: this.cpI18n.translate('admin_contact_trace_forms'),
            action: contactTraceMenu.manageForms,
            selected: adminContactTraceFormsPrivilege.w
          }
        ];
      }

      if (viewerContactTraceCasesPrivilege.w) {
        items = [
          ...items,
          {
            label: this.cpI18n.translate('cases'),
            action: contactTraceMenu.manageCases,
            selected: adminContactTraceCasesPrivilege.w
          }
        ];
      }

      if (viewerContactTraceNotificationsPrivilege.w) {
        items = [
          ...items,
          {
            label: this.cpI18n.translate('contact_trace_exposure_notification'),
            action: contactTraceMenu.manageNotifications,
            selected: adminContactTraceNotificationsPrivilege.w
          }
        ];
      }
    }

    if (viewerContactTraceDashboardPrivilege.r) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('contact_trace_health_dashboard'),
          action: contactTraceMenu.manageDashboard,
          selected: adminContactTraceDashboardPrivilege.r
        }
      ];
    }

    return items;
  }

  getNumberOf(privilegeType: number, accountPrivileges = {}) {
    let counter = 0;

    Object.keys(accountPrivileges).forEach((storeId) => {
      if (accountPrivileges[storeId][privilegeType]) {
        counter += 1;
      }
    });

    return counter;
  }

  manageAdminDropdown(privilege = { r: false, w: false }) {
    let items = [
      {
        label: this.cpI18n.translate('team_member_disabled'),
        action: manageAdminMenu.disabled
      }
    ];

    if (!privilege) {
      return items;
    }

    if (privilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_enabled'),
          action: manageAdminMenu.enabled
        }
      ];
    }

    return items;
  }

  clubsDropdown(schoolLevel = { r: false, w: false }, accountLevel = false) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: clubMenu.noAccess
      }
    ];

    if (!schoolLevel.w && !accountLevel) {
      return items;
    }

    if (accountLevel && !schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_clubs'),
          action: clubMenu.selectClubs
        }
      ];
    }

    if (schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_clubs'),
          action: clubMenu.selectClubs
        },
        {
          label: this.cpI18n.translate('admin_all_clubs'),
          action: clubMenu.allClubs
        }
      ];
    }

    return items;
  }

  athleticsDropdown(schoolLevel = { r: false, w: false }, accountLevel = false) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: athleticMenu.noAccess
      }
    ];

    if (!schoolLevel.w && !accountLevel) {
      return items;
    }

    if (accountLevel && !schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_athletics'),
          action: athleticMenu.selectAthletic
        }
      ];
    }

    if (schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_athletics'),
          action: athleticMenu.selectAthletic
        },
        {
          label: this.cpI18n.translate('admin_all_athletics'),
          action: athleticMenu.allAthletics
        }
      ];
    }

    return items;
  }

  servicesDropdown(schoolLevel = { r: false, w: false }, accountLevel = false) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: serviceMenu.noAccess
      }
    ];

    if (!schoolLevel.w && !accountLevel) {
      return items;
    }

    if (accountLevel && !schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_services'),
          action: serviceMenu.selectServices
        }
      ];
    }

    if (schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_services'),
          action: serviceMenu.selectServices
        },
        {
          label: this.cpI18n.translate('admin_all_services'),
          action: serviceMenu.allServices
        }
      ];
    }

    return items;
  }

  privacyDropdown() {
    const privacyDropdownItems = [
      {
        label: this.cpI18n.translate('admin_privacy_enabled'),
        action: PrivacyConfiguration.on
      },
      {
        label: this.cpI18n.translate('admin_privacy_disabled'),
        action: PrivacyConfiguration.off
      }
    ];
    return privacyDropdownItems;
  }

  isService(obj) {
    return (
      !!(CP_PRIVILEGES_MAP.services in obj) &&
      !!(CP_PRIVILEGES_MAP.events in obj) &&
      !!(CP_PRIVILEGES_MAP.event_attendance in obj)
    );
  }

  isClub(obj) {
    return (
      !!(CP_PRIVILEGES_MAP.clubs in obj) &&
      !!(CP_PRIVILEGES_MAP.events in obj) &&
      !!(CP_PRIVILEGES_MAP.event_attendance in obj)
    );
  }

  isAthletic(obj) {
    return (
      !!(CP_PRIVILEGES_MAP.athletics in obj) &&
      !!(CP_PRIVILEGES_MAP.events in obj) &&
      !!(CP_PRIVILEGES_MAP.event_attendance in obj)
    );
  }
}

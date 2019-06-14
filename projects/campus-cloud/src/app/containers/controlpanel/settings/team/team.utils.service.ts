import { Injectable } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

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

export enum manageAdminMenu {
  disabled = null,
  enabled = 1
}

@Injectable()
export class TeamUtilsService {
  constructor(public cpI18n: CPI18nService) {}

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
      !!(CP_PRIVILEGES_MAP.membership in obj) &&
      !!(CP_PRIVILEGES_MAP.moderation in obj) &&
      !!(CP_PRIVILEGES_MAP.event_attendance in obj)
    );
  }

  isAthletic(obj) {
    return (
      !!(CP_PRIVILEGES_MAP.athletics in obj) &&
      !!(CP_PRIVILEGES_MAP.events in obj) &&
      !!(CP_PRIVILEGES_MAP.membership in obj) &&
      !!(CP_PRIVILEGES_MAP.moderation in obj) &&
      !!(CP_PRIVILEGES_MAP.event_attendance in obj)
    );
  }
}

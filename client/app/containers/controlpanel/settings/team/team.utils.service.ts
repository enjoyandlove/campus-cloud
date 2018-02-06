import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../../shared/services';
import { CP_PRIVILEGES_MAP } from './../../../../shared/constants/privileges';

export enum clubMenu {
  noAccess = null,
  selectClubs = 2,
  allClubs = 3,
}

export enum serviceMenu {
  noAccess = null,
  selectServices = 2,
  allServices = 3,
}

export enum eventMenu {
  noAccess = null,
  manageEvents = 2,
  manageEventsAndAssess = 3,
}

export enum manageAdminMenu {
  disabled = null,
  enabled = 1,
}

@Injectable()
export class TeamUtilsService {
  constructor(public cpI18n: CPI18nService) {}

  eventsDropdown(
    eventPrivilege = { r: false, w: false },
    eventAssessmentPrivilege = { r: false, w: false },
  ): Array<any> {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: eventMenu.noAccess,
      },
    ];

    if (!eventPrivilege.r) {
      return items;
    }

    if (eventPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_manage_events'),
          action: eventMenu.manageEvents,
        },
      ];
    }

    if (eventAssessmentPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_manage_and_assess_events'),
          action: eventMenu.manageEventsAndAssess,
        },
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
        action: manageAdminMenu.disabled,
      },
    ];

    if (!privilege) {
      return items;
    }

    if (privilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_enabled'),
          action: manageAdminMenu.enabled,
        },
      ];
    }

    return items;
  }

  clubsDropdown(schoolLevel = { r: false, w: false }, accountLevel = false) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: clubMenu.noAccess,
      },
    ];

    if (!schoolLevel.w && !accountLevel) {
      return items;
    }

    if (accountLevel && !schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_clubs'),
          action: clubMenu.selectClubs,
        },
      ];
    }

    if (schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_clubs'),
          action: clubMenu.selectClubs,
        },
        {
          label: this.cpI18n.translate('admin_all_clubs'),
          action: clubMenu.allClubs,
        },
      ];
    }

    return items;
  }

  servicesDropdown(schoolLevel = { r: false, w: false }, accountLevel = false) {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: serviceMenu.noAccess,
      },
    ];

    if (!schoolLevel.w && !accountLevel) {
      return items;
    }

    if (accountLevel && !schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_services'),
          action: serviceMenu.selectServices,
        },
      ];
    }

    if (schoolLevel.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_select_services'),
          action: serviceMenu.selectServices,
        },
        {
          label: this.cpI18n.translate('admin_all_services'),
          action: serviceMenu.allServices,
        },
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
}

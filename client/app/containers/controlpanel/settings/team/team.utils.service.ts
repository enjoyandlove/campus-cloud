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

@Injectable()
export class TeamUtilsService {
  constructor(public cpI18n: CPI18nService) {}
  clearFields = (obj) => {
    delete obj.is_club;
    delete obj.is_service;
  };

  cleanExtraFields = (privileges) => {
    const res = {};

    Object.keys(privileges).forEach((storeId) => {
      this.clearFields(privileges[storeId]);

      res[storeId] = {
        ...privileges[storeId],
      };

      if (!Object.keys(res[storeId]).length) {
        delete res[storeId];
      }
    });

    return res;
  };

  eventsDropdown = function(
    eventPrivilege = { r: false, w: false },
    eventAssessmentPrivilege = { r: false, w: false },
  ): Array<any> {
    let items = [
      {
        label: this.cpI18n.translate('admin_no_access'),
        action: null,
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
          action: 2,
        },
      ];
    }

    if (eventAssessmentPrivilege.w) {
      items = [
        ...items,
        {
          label: this.cpI18n.translate('admin_manage_and_assess_events'),
          action: 3,
        },
      ];
    }

    return items;
  };

  getNumberOf(privilegeType: number, accountPrivileges = {}) {
    let counter = 0;

    Object.keys(accountPrivileges).forEach((storeId) => {
      if (accountPrivileges[storeId][privilegeType]) {
        counter += 1;
      }
    });

    return counter;
  }

  manageAdminDropdown = function(privilege = { r: false, w: false }) {
    let items = [
      {
        label: this.cpI18n.translate('team_member_disabled'),
        action: null,
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
          action: 1,
        },
      ];
    }

    return items;
  };

  clubsDropdown = (
    schoolLevel = { r: false, w: false },
    accountLevel = false,
  ) => {
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
  };

  servicesDropdown = function(
    schoolLevel = { r: false, w: false },
    accountLevel = false,
  ) {
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
  };

  isService = (obj) => {
    return (
      CP_PRIVILEGES_MAP.services in obj &&
      CP_PRIVILEGES_MAP.events in obj &&
      CP_PRIVILEGES_MAP.event_attendance in obj
    );
  };

  setStoreType = (privileges) => {
    const res = {};

    Object.keys(privileges).forEach((storeId) => {
      res[storeId] = {
        ...privileges[storeId],
        is_club: !this.isService(privileges[storeId]),
        is_service: this.isService(privileges[storeId]),
      };
    });

    return res;
  };
}

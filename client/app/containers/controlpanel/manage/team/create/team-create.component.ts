import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CP_PRIVILEGES, CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { ErrorService, AdminService, CPI18nService } from '../../../../../shared/services';

import {
  accountsToStoreMap,
  canSchoolReadResource,
  canAccountLevelReadResource
} from './../../../../../shared/utils/privileges/privileges';

const _cpI18n = new CPI18nService();

const eventsDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': _cpI18n.translate('admin_no_access'),
      'action': null
    },
    {
      'label': _cpI18n.translate('admin_manage_events'),
      'action': 2
    }
  ];

  if (!privilege) {
    return items;
  }

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': _cpI18n.translate('admin_manage_and_assess_events'),
        'action': 3
      }
    ];
  }
  return items;
};

const manageAdminDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': _cpI18n.translate('disabled'),
      'action': null
    }
  ];

  if (!privilege) {
    return items;
  }

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': _cpI18n.translate('enabled'),
        'action': 1
      }
    ];
  }
  return items;
};

const clubsDropdown = (schoolLevel = { r: false, w: false },
                       accountLevel = false)  => {

  let items = [
    {
      'label': _cpI18n.translate('admin_no_access'),
      'action': null
    }
  ];

  if (!schoolLevel.w && !accountLevel) {
    return items;
  }

  if (accountLevel && !schoolLevel.w) {
    items = [
      ...items,
      {
        'label': _cpI18n.translate('admin_select_clubs'),
        'action': 2
      }
    ];
  }

  if (schoolLevel.w) {
    items = [
      ...items,
      {
        'label': _cpI18n.translate('admin_select_clubs'),
        'action': 2
      },
      {
        'label': _cpI18n.translate('admin_all_clubs'),
        'action': 3
      }
    ]
  }

  return items;
};

const servicesDropdown = function (schoolLevel = { r: false, w: false },
                                   accountLevel = false) {
  let items = [
    {
      'label': _cpI18n.translate('admin_no_access'),
      'action': null
    }
  ];

  if (!schoolLevel.w && !accountLevel) {
    return items;
  }

  if (accountLevel && !schoolLevel.w) {
    items = [
      ...items,
      {
        'label': _cpI18n.translate('admin_select_services'),
        'action': 2
      },
    ];
  }


  if (schoolLevel.w) {
    items =  [
      ...items,
      {
        'label': _cpI18n.translate('admin_select_services'),
        'action': 2
      },
      {
        'label': _cpI18n.translate('admin_all_services'),
        'action': 3
      },
    ]
  }
  return items;
};

declare var $: any;

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  user;
  formData;
  schoolId;
  formError;
  clubsMenu;
  eventsMenu;
  buttonData;
  isFormError;
  canReadClubs;
  manageAdmins;
  servicesMenu;
  isClubsModal;
  canReadEvents;
  isServiceModal;
  canReadServices;
  form: FormGroup;
  accountPrivileges;
  isAllAccessEnabled;
  clubsCount = null;
  servicesCount = null;
  schoolPrivileges = {};
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

  resetClubsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private teamService: AdminService,
    private errorService: ErrorService
  ) { }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'email': [null, Validators.required]
    });

    this.form.valueChanges.subscribe(_ => {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: !this.form.valid });
    })
  }

  onSubmit(data) {
    this.formError = null;
    this.isFormError = false;

    if (!this.form.valid) {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.errorService.handleError({ reason: this.cpI18n.translate('all_fields_are_required') });
      return;
    }

    let _data = {
      ...data,
      school_level_privileges: {
        [this.schoolId]: {
          ...this.schoolPrivileges
        }
      },
      account_level_privileges: {
        ...this.accountPrivileges
      }
    };

    const isEmpty = require('lodash').isEmpty;
    const emptyAccountPrivileges = isEmpty(_data.account_level_privileges);
    const emptySchoolPrivileges = isEmpty(_data.school_level_privileges[this.schoolId]);

    if (emptyAccountPrivileges && emptySchoolPrivileges) {
      this.formError = this.cpI18n.translate('admins_error_no_access_granted');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.isFormError = true;
      return;
    }

    this
      .teamService
      .createAdmin(_data)
      .subscribe(
      _ => this.router.navigate(['/manage/team']),
      err => {
        this.isFormError = true;

        if (err.status === 409) {
          this.formError = this.cpI18n.translate('duplicate_entry');
          return;
        }

        this.formError = this.cpI18n.translate('something_went_wrong');
      }
      );
  }

  onManageAdminSelected(data) {
    if (!data.action) {
      if (CP_PRIVILEGES_MAP.manage_admin in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      }
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.manage_admin]: {
          r: true,
          w: true
        }
      }
    );
  }

  toggleAllAccess(checked) {
    if (checked) {
      this.accountPrivileges = Object.assign(
        {},
        accountsToStoreMap(this.session.g.get('user').account_mapping[this.schoolId],
                           this.user.account_level_privileges)
      );

      this.schoolPrivileges = Object.assign(
        {},
        this.user.school_level_privileges[this.schoolId]
      );

      return;
    }

    this.schoolPrivileges = {};
    this.accountPrivileges = {};
  }

  onServicesModalSelected(services) {
    const servicesLength = Object.keys(services).length;
    this.servicesCount = servicesLength ? {label: `${servicesLength} Service(s)`} : null;

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...services
    );
  }

  onServicesSelected(service) {
    this.doServicesCleanUp();

    if (service.action === 2) {
      this.isServiceModal = true;

      setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
      return;
    }

    if (service.action === null) {
      this.resetServiceModal$.next(true);

      if (this.schoolPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
          delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
        }
      }
      return;
    }

    this.resetServiceModal$.next(true);

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.services]: {
          r: service.action === 2 ? true : true,
          w: service.action === 2 ? false : true
        }
      }
    );
  }

  onClubsModalSelected(clubs) {
    const clubsLength = Object.keys(clubs).length;
    this.clubsCount = clubsLength ? {label: `${clubsLength} Club(s)`} : null;

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...clubs
    );
  }

  doClubsCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.clubs);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.events);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.membership);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.moderation);

    if (CP_PRIVILEGES_MAP.clubs in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
    }
    if (CP_PRIVILEGES_MAP.membership in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.membership];
    }
    if (CP_PRIVILEGES_MAP.moderation in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.moderation];
    }
  }

  doServicesCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.events);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.services);

    if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
    }
  }

  onClubsSelected(club) {
    this.doClubsCleanUp();

    if (club.action === 2) {
      this.isClubsModal = true;
      setTimeout(() => { $('#selectClubsModal').modal() }, 1);
      return;
    }

    if (club.action === null) {
      this.resetClubsModal$.next(true);
      return;
    }

    this.resetClubsModal$.next(true);

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w: this.session.g.get('user')
            .school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.moderation]: {
          r: true,
          w: this.session.g.get('user')
            .school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.membership]: {
          r: true,
          w: this.session.g.get('user')
            .school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      if (CP_PRIVILEGES_MAP.events in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.events];
      }
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.events]: {
          r: event.action === 2 ? true : true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }

  handleDependencies(privilegeNo, dependencies: Array<number>) {
    if (!dependencies.length) { return; }

    dependencies.map(dep => {
      if (this.schoolPrivileges[dep]) {
        return;
      }

      if (this.schoolPrivileges[privilegeNo]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  disableDependencies(deps: Array<number>) {
    deps.map(dep => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }


  checkControl(isChecked, privilegeNo, privilegeExtraData): void {
    if (!isChecked && privilegeExtraData.disables) {
      this.disableDependencies(privilegeExtraData.disables);
    }

    if (this.schoolPrivileges && this.schoolPrivileges[privilegeNo]) {
      delete this.schoolPrivileges[privilegeNo];
      this.handleDependencies(privilegeNo, privilegeExtraData.deps);
      return;
    }

    let privilege = this.user.school_level_privileges[this.schoolId][privilegeNo];

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [privilegeNo]: {
          r: privilege.r,
          w: privilege.w
        }
      });

    this.handleDependencies(privilegeNo, privilegeExtraData.deps);
  }

  ngOnInit() {
    const session = this.session.g;
    const { school_level_privileges	 } = session.get('user');
    const schoolPrivileges = school_level_privileges[session.get('school').id];
    this.user = session.get('user');
    this.schoolId = session.get('school').id;

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('admin_create_button')
    }


    this.canReadClubs = canSchoolReadResource(session, CP_PRIVILEGES_MAP.clubs) ||
      canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.clubs);

    this.canReadEvents = canSchoolReadResource(session, CP_PRIVILEGES_MAP.events);

    this.canReadServices = canSchoolReadResource(session, CP_PRIVILEGES_MAP.services) ||
      canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.services);

    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();
    this.buildForm();

    const clubsPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.clubs];

    const clubsPrivilegeAccount = canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.clubs);

    const eventsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events];

    const servicesPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.services];

    const servicesPrivilegeAccount = canAccountLevelReadResource(session,
        CP_PRIVILEGES_MAP.services);

    const manageAdminPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

    this.eventsMenu = eventsDropdown(eventsPrivilege);
    this.clubsMenu = clubsDropdown(clubsPrivilegeSchool, clubsPrivilegeAccount);
    this.servicesMenu = servicesDropdown(servicesPrivilegeSchool, servicesPrivilegeAccount);
    this.manageAdmins = manageAdminDropdown(manageAdminPrivilege);
  }
}

export const accountCleanUp = function(accountPrivileges, privilegeNo: number) {
  if (accountPrivileges) {
    Object.keys(accountPrivileges).map(store => {
      if (privilegeNo in accountPrivileges[store]) {
        delete accountPrivileges[store][privilegeNo]

        if (!(Object.keys(accountPrivileges[store]).length)) {
          delete accountPrivileges[store];
        }
      }
    })
  }
  return accountPrivileges;
}

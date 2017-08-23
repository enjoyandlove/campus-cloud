import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { STATUS } from '../../../../../shared/constants';
import { BaseComponent } from '../../../../../base/base.component';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { AdminService, ErrorService } from '../../../../../shared/services';
import { CPSession } from '../../../../../session';
import { CP_PRIVILEGES, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

const eventsDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    },
    {
      'label': 'Manage Events',
      'action': 2
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Manage and Assess Events',
        'action': 3
      }
    ];
  }
  return items;
};

const manageAdminDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'Disabled',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Enabled',
        'action': 1
      }
    ];
  }
  return items;
};

const clubsDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Select Clubs',
        'action': 2
      },
      {
        'label': 'All Clubs',
        'action': 3
      },
    ];
  }
  return items;
};

const servicesDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Select Services',
        'action': 2
      },
      {
        'label': 'All Services',
        'action': 3
      },
    ];
  }
  return items;
};


declare var $: any;

@Component({
  selector: 'cp-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent extends BaseComponent implements OnInit {
  user;
  adminId;
  loading;
  formData;
  schoolId;
  formError;
  clubsMenu;
  eventsMenu;
  privileges;
  isFormError;
  canReadClubs;
  manageAdmins;
  servicesMenu;
  isClubsModal;
  isCurrentUser;
  canReadEvents;
  isServiceModal;
  canReadServices;
  form: FormGroup;
  schoolPrivileges;
  accountPrivileges;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

  resetClubsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private adminService: AdminService,
    private errorService: ErrorService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.adminId = this.route.snapshot.params['adminId'];

    this.fetch();
  }

  private fetch() {
    const _ = require('lodash');
    const admin$ = this.adminService.getAdminById(this.adminId);

    super
      .fetchData(admin$)
      .then(res => {
        this.isCurrentUser = res.data.id === this.session.user.id;

        this.buildHeader(`${res.data.firstname} ${res.data.lastname}`);

        this.buildForm(res.data);

        this.schoolPrivileges = Object.assign(
          {},
          res.data.school_level_privileges[this.schoolId]
        );

        this.accountPrivileges = Object.assign(
          {},
          res.data.account_level_privileges
        );

        this.isAllAccessEnabled = _.isEqual(this.schoolPrivileges,
          this.user.school_level_privileges[this.schoolId]) && _.isEqual(this.accountPrivileges,
            this.user.account_level_privileges);
      })
      .catch(err => console.log(err));
  }

  servicesDefaultPermission() {
    let selected;
    let school_level_privileges = this.schoolPrivileges;
    let service_privilege = school_level_privileges[CP_PRIVILEGES_MAP.services];

    if (!service_privilege) {
      selected = this.servicesMenu[0];
      Object.keys(this.accountPrivileges).forEach(store => {
        if (this.accountPrivileges[store][CP_PRIVILEGES_MAP.services]) {
          selected = this.servicesMenu[1];
        }
      });
    } else if (service_privilege.r && service_privilege.w) {
      selected = this.servicesMenu[2];
    } else {
      selected = this.servicesMenu[1];
    }

    return selected;
  }

  clubsDefaultPermission() {
    let selected;
    let school_level_privileges = this.schoolPrivileges;
    let club_privilege = school_level_privileges[CP_PRIVILEGES_MAP.clubs];

    if (!club_privilege) {
      selected = this.clubsMenu[0];
      Object.keys(this.accountPrivileges).forEach(store => {
        if (this.accountPrivileges[store][CP_PRIVILEGES_MAP.clubs]) {
          selected = this.clubsMenu[1];
        }
      });
    } else if (club_privilege.r && club_privilege.w) {
      selected = this.clubsMenu[2];
    } else {
      selected = this.clubsMenu[1];
    }

    return selected;
  }

  eventsDefaultPermission() {
    let selected;
    let school_level_privileges = this.schoolPrivileges;
    let event_privilege = school_level_privileges[CP_PRIVILEGES_MAP.events];

    if (!event_privilege) {
      selected = this.eventsMenu[0];
    } else if (event_privilege.r && event_privilege.w) {
      selected = this.eventsMenu[2];
    } else if (event_privilege.r && !event_privilege.w) {
      selected = this.eventsMenu[1];
    } else {
      selected = this.eventsMenu[0];
    }

    return selected;
  }

  private buildHeader(name) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': `${name}`,
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  private buildForm(profile) {
    this.form = this.fb.group({
      'firstname': [profile.firstname, Validators.required],
      'lastname': [profile.lastname, Validators.required],
      'email': [profile.email, Validators.required]
    });
  }

  onSubmit(data) {
    this.formError = null;
    this.isFormError = false;

    if (!this.form.valid) {
      this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    let _data = {
      school_level_privileges: {
        [this.schoolId]: {
          ...this.schoolPrivileges
        }
      },
      account_level_privileges: {
        ...this.accountPrivileges
      }
    };

    if (this.isCurrentUser) {
      /**
       * @data (firstname, lastname, email)
       * this fields are only needed when updating the
       * current user, if sent when updating another user the BE fails
       */
      _data = Object.assign({}, _data, ...data);
    }

    const isEmpty = require('lodash').isEmpty;
    const emptyAccountPrivileges = isEmpty(_data.account_level_privileges);
    const emptySchoolPrivileges = isEmpty(_data.school_level_privileges[this.schoolId]);

    if (emptyAccountPrivileges && emptySchoolPrivileges) {
      this.formError = 'You have not granted any access';
      this.isFormError = true;
      return;
    }

    this
      .adminService
      .updateAdmin(this.adminId, _data)
      .subscribe(
      _ => this.router.navigate(['/manage/team']),
      err => {
        this.isFormError = true;

        if (err.status === 409) {
          this.formError = STATUS.DUPLICATE_ENTRY;
          return;
        }

        this.formError = STATUS.SOMETHING_WENT_WRONG;
      }
      );
  }

  doServicesCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.services);
  }

  onManageAdminSelected(data) {
    if (!data.action && this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
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
        this.user.account_level_privileges
      );

      this.schoolPrivileges = Object.assign(
        {},
        this.user.school_level_privileges[this.schoolId]
      );
      return;
    }

    this.accountPrivileges = {};
    this.schoolPrivileges = {};
  }

  onServicesModalSelected(services) {
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...services
    );
  }

  doClubsCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.clubs);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.membership);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.moderation);
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

      if (this.accountPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.accountPrivileges) {
          delete this.accountPrivileges[CP_PRIVILEGES_MAP.services];
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
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...clubs
    );
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

      if (CP_PRIVILEGES_MAP.clubs in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
      }
      if (CP_PRIVILEGES_MAP.membership in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.membership];
      }
      if (CP_PRIVILEGES_MAP.moderation in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.moderation];
      }

      return;
    }

    this.resetClubsModal$.next(true);

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.moderation]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.membership]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
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
          r: true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }

  disableDependencies(deps: Array<number>) {
    deps.map(dep => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
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
    this.user = this.session.user;
    this.schoolId = this.session.school.id;
    let schoolPrivileges = this.user.school_level_privileges[this.schoolId];

    this.canReadClubs = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.clubs) ||
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.clubs);

    this.canReadEvents = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.events);

    this.canReadServices = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.services) ||
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.services);

    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    const clubsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
    const eventsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events];
    const servicesPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.services];
    const manageAdminPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

    this.clubsMenu = clubsDropdown(clubsPrivilege);
    this.eventsMenu = eventsDropdown(eventsPrivilege);
    this.servicesMenu = servicesDropdown(servicesPrivilege);
    this.manageAdmins = manageAdminDropdown(manageAdminPrivilege);
  }
}

function accountCleanUp(accountPrivileges, privilegeNo: number) {
  if (accountPrivileges) {
    Object.keys(accountPrivileges).map(store => {
      if (privilegeNo in accountPrivileges[store]) {
        delete accountPrivileges[store][privilegeNo]
      }
    })
  }
  return accountPrivileges;
}

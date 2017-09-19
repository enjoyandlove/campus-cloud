import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { accountCleanUp } from './../create/team-create.component';
import { BaseComponent } from '../../../../../base/base.component';
import { accountsToStoreMap } from './../../../../../session/index';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { AdminService, ErrorService } from '../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CP_PRIVILEGES, CP_PRIVILEGES_MAP } from '../../../../../shared/constants';

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

  if (!privilege) {
    return items;
  }

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

  if (!privilege) {
    return items;
  }

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

  if (!privilege) {
    return items;
  }

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

  if (!privilege) {
    return items;
  }

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
  buttonData;
  eventsMenu;
  privileges;
  editingUser;
  isFormError;
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
  currentUserCanManage;
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
        this.editingUser = res.data;

        this.isCurrentUser = this.editingUser.id === this.session.g.get('user').id;


        this.buildHeader(`${this.editingUser.firstname} ${this.editingUser.lastname}`);

        this.buildForm(this.editingUser);

        this.schoolPrivileges = Object.assign(
          {},
          this.editingUser.school_level_privileges[this.schoolId]
        );

        this.accountPrivileges = Object.assign(
          {},
          this.editingUser.account_level_privileges
        );

        this.isAllAccessEnabled = _.isEqual(this.schoolPrivileges,
          this.user.school_level_privileges[this.schoolId]) && _.isEqual(this.accountPrivileges,
            this.user.account_level_privileges);
      })
      .catch(err => { throw new Error(err) });
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

    this.form.valueChanges.subscribe(_ => {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
    })
  }

  onSubmit(data) {
    this.formError = null;
    this.isFormError = false;

    if (!this.form.valid) {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    let _data: any = {
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
      this.formError = 'You have not granted any access';
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.isFormError = true;
      return;
    }

    if (this.isCurrentUser) {
      /**
       * @data (firstname, lastname, email)
       * this fields are only needed when updating the
       * current user, if sent when updating another user the BE fails
       */
      const { firstname, lastname } = data;

      _data = { firstname, lastname };
    }

    this
      .adminService
      .updateAdmin(this.adminId, _data)
      .subscribe(
      _ => this.router.navigate([this.currentUserCanManage ? '/manage/team' : '/welcome']),
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

  onManageAdminSelected(data) {
    if (!data.action) {
      this.removePrivilegeFromRandomAccount(CP_PRIVILEGES_MAP.manage_admin);

      if (CP_PRIVILEGES_MAP.manage_admin in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      }

      Object.keys(this.accountPrivileges).forEach(storeId => {
        if (!(Object.keys(this.accountPrivileges[storeId]).length)) {
          delete this.accountPrivileges[storeId];
        }
      });
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
    this.doServicesCleanUp();

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...services
    );
  }

  doServicesCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.services);

    if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
    }
  }

  onServicesSelected(service) {
    if (service.action === 2) {
      this.isServiceModal = true;
      setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
      return;
    }

    this.doServicesCleanUp();
    this.resetServiceModal$.next(true);
    this.removePrivilegeFromRandomAccount(CP_PRIVILEGES_MAP.services);

    Object.keys(this.accountPrivileges).forEach(storeId => {
      if (!(Object.keys(this.accountPrivileges[storeId]).length)) {
        delete this.accountPrivileges[storeId];
      }
    });

    if (service.action === null) {

      if (this.schoolPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
          delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
        }
      }
      return;
    }

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

  doClubsCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.clubs);
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

  onClubsModalSelected(clubs) {
    this.doClubsCleanUp();

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...clubs
    );
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      this.isClubsModal = true;
      setTimeout(() => { $('#selectClubsModal').modal() }, 1);
      return;
    }

    this.doClubsCleanUp();
    this.resetClubsModal$.next(true);
    this.removePrivilegeFromRandomAccount(CP_PRIVILEGES_MAP.clubs);

    Object.keys(this.accountPrivileges).forEach(storeId => {
      if (!(Object.keys(this.accountPrivileges[storeId]).length)) {
        delete this.accountPrivileges[storeId];
      }
    });

    if (club.action === null) {
      this.resetClubsModal$.next(true);
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.clubs];
      return;
    }

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
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      { ...this.removePrivilegeFromRandomAccount(CP_PRIVILEGES_MAP.events) }
    )

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

  disableDependencies(deps: Array<number>) {
    deps.forEach(dep => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  handleDependencies(privilegeNo, dependencies: Array<number>) {
    if (!dependencies.length) { return; }

    dependencies.forEach(dep => {

      if (this.schoolPrivileges[dep]) {
        return;
      }

      if (this.schoolPrivileges[privilegeNo]) {
        this.checkControl(undefined, dep, { deps: [] });
      }

    });
  }

  removePrivilegeFromRandomAccount(privilegeType: number) {
    const stores = accountsToStoreMap(this.editingUser.account_mapping[this.schoolId],
                                        this.editingUser.account_level_privileges);

    Object.keys(stores).map(storeId => {
      if (privilegeType in stores[storeId]) {
        delete stores[storeId][privilegeType];

        if (!(Object.keys(stores[storeId]).length)) {
         delete stores[storeId];
        }
      }
    });

    return stores;
  }

  checkControl(isChecked, privilegeNo, privilegeExtraData): void {
    if (!isChecked) {
      this.accountPrivileges = Object.assign(
        {},
        this.accountPrivileges,
        { ...this.removePrivilegeFromRandomAccount(privilegeNo) }
      )

      Object.keys(this.accountPrivileges).forEach(storeId => {
        if (!(Object.keys(this.accountPrivileges[storeId]).length)) {
          delete this.accountPrivileges[storeId];
        }
      });
    }

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
    this.user = this.session.g.get('user');
    this.schoolId = this.session.g.get('school').id;

    this.buttonData = {
      class: 'primary',
      text: 'Update'
    }

    let schoolPrivileges = this.user.school_level_privileges[this.schoolId];

    if (CP_PRIVILEGES_MAP.manage_admin in schoolPrivileges) {
      this.currentUserCanManage = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin].w;
    } else {
      this.currentUserCanManage = false;
    }

    this.canReadEvents = schoolPrivileges[CP_PRIVILEGES_MAP.events];
    this.canReadServices = schoolPrivileges[CP_PRIVILEGES_MAP.services];
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

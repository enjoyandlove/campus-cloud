import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  manageAdmins;
  servicesMenu;
  form: FormGroup;
  schoolPrivileges;
  accountPrivileges;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

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

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
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

    this
      .adminService
      .createAdmin(_data)
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

  onManageAdminSelected(data) {
    if (!data.action) {
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      return;
    }

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
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

  onServicesSelected(service) {
    if (service.action === 2) {
      $('#selectServicesModal').modal();
      return;
    }

    if (service.action === null) {
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.services];
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

  onClubsModalSelected(clubs) {
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...clubs
    );
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      $('#selectClubsModal').modal();
      return;
    }

    if (club.action === null) {
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.clubs];
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: club.action === 2 ? true : true,
          w: club.action === 2 ? false : true
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.events];
      return;
    }

    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      {
        [CP_PRIVILEGES_MAP.events]: {
          r: event.action === 2 ? true : true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }

  checkControl(checked, type): void {
    if (this.schoolPrivileges && this.schoolPrivileges[type]) {
      delete this.schoolPrivileges[type];
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [type]: {
          r: checked,
          w: checked
        }
      });
  }

  ngOnInit() {
    this.user = this.session.user;
    this.schoolId = this.session.school.id;
    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();

    this.servicesMenu = [
      {
        'label': 'No Access',
        'action': null
      },
      {
        'label': 'Select services',
        'action': 2
      },
      {
        'label': 'All services',
        'action': 3
      },
    ];

    this.manageAdmins = [
      {
        'label': 'Disabled',
        'action': null
      },
      {
        'label': 'Enabled',
        'action': 1
      }
    ];

    this.clubsMenu = [
      {
        'label': 'No Access',
        'action': null
      },
      {
        'label': 'Select clubs',
        'action': 2
      },
      {
        'label': 'All clubs',
        'action': 3
      },
    ];

    this.eventsMenu = [
      {
        'label': 'No access',
        'action': null
      },
      {
        'label': 'Manage events',
        'action': 2
      },
      {
        'label': 'Manage and assess events',
        'action': 3
      }
    ];
  }
}

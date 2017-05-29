import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { ErrorService, AdminService } from '../../../../../shared/services';
import { CP_PRIVILEGES, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

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
  isFormError;
  manageAdmins;
  servicesMenu;
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
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
      .teamService
      .createAdmin(_data)
      .subscribe(
      _ => this.router.navigate(['/manage/team']),
      err => {
        this.isFormError = true;

        if (err.status === 409) {
          this.formError = STATUS.DUPLICATE_ENTRY;
          return;
        }

        this.formError = 'Something went wrong';
      }
      );
  }

  onManageAdminSelected(data) {
    if (!data.action) {
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

  onServicesSelected(service) {
    if (service.action === 2) {
      this.isServiceModal = true;

      setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
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
      {
        [CP_PRIVILEGES_MAP.clubs]: { ...clubs }
      }
    );
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      $('#selectClubsModal').modal();
      return;
    }

    if (club.action === null) {
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.clubs];
      delete this.accountPrivileges[CP_PRIVILEGES_MAP.moderation];
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: club.action === 2 ? true : true,
          w: club.action === 2 ? false : true
        },

        [CP_PRIVILEGES_MAP.moderation]: {
          r: club.action === 2 ? true : true,
          w: club.action === 2 ? false : true
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.events];
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


  checkControl(_, type): void {
    if (this.schoolPrivileges && this.schoolPrivileges[type]) {
      delete this.schoolPrivileges[type];
      return;
    }

    let privilege = this.user.school_level_privileges[this.schoolId][type];

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [type]: {
          r: privilege.r,
          w: privilege.w
        }
      });
  }

  ngOnInit() {
    this.user = this.session.user;
    this.schoolId = this.session.school.id;
    let schoolPrivileges = this.user.school_level_privileges[this.schoolId];

    this.canReadEvents = schoolPrivileges[CP_PRIVILEGES_MAP.events];
    this.canReadServices = schoolPrivileges[CP_PRIVILEGES_MAP.services];
    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();
    this.buildForm();

    this.servicesMenu = [
      {
        'label': 'No Access',
        'action': null
      },
      {
        'label': 'Select Services',
        'action': 2
      },
      {
        'label': 'All Services',
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
        'label': 'Select Clubs',
        'action': 2
      },
      {
        'label': 'All Clubs',
        'action': 3
      },
    ];

    this.eventsMenu = [
      {
        'label': 'No Access',
        'action': null
      },
      {
        'label': 'Manage Events',
        'action': 2
      },
      {
        'label': 'Manage and Assess Events',
        'action': 3
      }
    ];
  }
}

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { CP_PRIVILEGES } from '../../../../../shared/utils';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { ErrorService, AdminService } from '../../../../../shared/services';
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
  privileges;
  isFormError;
  manageAdmins;
  servicesMenu;
  form: FormGroup;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;

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
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'email': ['', Validators.required]
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
          ...this.privileges
        }
      }
    };

    this
      .teamService
      .createAdmin(_data)
      .subscribe(
        _ => this.router.navigate['/manage/team'],
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
      delete this.privileges[10];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        10: {
          r: true,
          w: true
        }
      }
    );
  }

  toggleAllAccess(checked) {
   if (checked) {
     this.privileges = Object.assign({}, this.user.school_level_privileges[this.schoolId]);
     return;
   }
   this.privileges = {};
  }

  onServicesModalSelected(services) {
    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        24: {...services}
      }
    );
  }

  onServicesSelected(service) {
    if (service.action === 2) {
      $('#selectServicesModal').modal();
      return;
    }

    if (service.action === null) {
      delete this.privileges[24];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        24 : {
          r: service.action === 2 ? true : true,
          w: service.action === 2 ? false : true
        }
      }
    );
  }

  onClubsModalSelected(clubs) {
    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        22: {...clubs}
      }
    );
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      $('#selectClubsModal').modal();
      return;
    }

    if (club.action === null) {
      delete this.privileges[22];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        22 : {
          r: club.action === 2 ? true : true,
          w: club.action === 2 ? false : true
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      delete this.privileges[18];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        18 : {
          r: event.action === 2 ? true : true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }


  checkControl(checked, type): void {

    if (this.privileges && this.privileges[type]) {
      delete this.privileges[type];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        [type]: {
          r: checked,
          w: checked
        }
      });
  }

  ngOnInit() {
    this.schoolId = 157;
    this.user = this.session.user;
    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();
    this.buildForm();

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

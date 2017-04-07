import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
// import { STATUS } from '../../../../../shared/constants';
import { ErrorService } from '../../../../../shared/services';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { CP_PRIVILEGES, appStorage } from '../../../../../shared/utils';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

declare var $: any;

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  formData;
  clubsMenu;
  eventsMenu;
  privileges;
  servicesMenu;
  form: FormGroup;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
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
    console.log(data);
    // console.log(this.form);
    console.log(this.privileges);
    // if (!this.form.valid) {
    //   this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
    //   return;
    // }
  }

  toggleAllAccess(checked) {
    // 1 -> no access - 2 -> all access
    let value = checked ? 2 : 1;
    this.form.controls['clubs'].setValue(value);
    this.form.controls['events'].setValue(value);
    this.form.controls['services'].setValue(value);
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
          r: service.action,
          w: service.action
        }
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
          r: club.action,
          w: club.action
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
          w: event.action === 2 ? false : false
        }
      }
    );
  }


  checkControl(checked, type): void {
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
    let user = JSON.parse(appStorage.get(appStorage.keys.PROFILE));
    this.formData = TEAM_ACCESS.getMenu(user.school_level_privileges[157]);

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
